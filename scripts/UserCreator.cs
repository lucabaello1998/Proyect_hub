using System;
using System.Data.SqlClient;
using BCrypt.Net;
using System.Text.Json;
using System.IO;

namespace ProyectHubCli
{
    class UserCreator
    {
        static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                Console.WriteLine("Uso: UserCreator <username> <password>");
                return;
            }

            string username = args[0];
            string password = args[1];

            if (string.IsNullOrWhiteSpace(username) || !username.Contains("@"))
            {
                Console.WriteLine("Error: El username debe tener formato email.");
                return;
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                Console.WriteLine("Error: La contraseña es requerida.");
                return;
            }

            string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            string configPath = env == "Production"
                ? Path.Combine("..", "config", "secrets", "production", "ProyectHub.Api.appsettings.json")
                : Path.Combine("..", "config", "secrets", "local", "ProyectHub.Api.appsettings.json");

            if (!File.Exists(configPath))
            {
                Console.WriteLine($"No se encontró el archivo de configuración: {configPath}");
                return;
            }

            string json = File.ReadAllText(configPath);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            string connectionString = root.GetProperty("ConnectionStrings").GetProperty("DefaultConnection").GetString() ?? string.Empty;

            using var connection = new SqlConnection(connectionString);
            connection.Open();

            // Validar si el usuario ya existe
            using (var checkCmd = connection.CreateCommand())
            {
                checkCmd.CommandText = "SELECT COUNT(*) FROM Users WHERE Username = @Username";
                checkCmd.Parameters.AddWithValue("@Username", username);
                int exists = (int)checkCmd.ExecuteScalar();
                if (exists > 0)
                {
                    Console.WriteLine("Error: El usuario ya existe.");
                    return;
                }
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            using var command = connection.CreateCommand();
            command.CommandText = "INSERT INTO Users (Username, PasswordHash) VALUES (@Username, @PasswordHash)";
            command.Parameters.AddWithValue("@Username", username);
            command.Parameters.AddWithValue("@PasswordHash", passwordHash);

            try
            {
                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    Console.WriteLine($"Usuario creado correctamente: {username}");
                }
                else
                {
                    Console.WriteLine("Error al crear el usuario.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
