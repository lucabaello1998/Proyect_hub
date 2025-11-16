#Usage: .\create-user.ps1 -Username "usuario" -Password (Read-Host -AsSecureString "Contraseña")

param(
    [Parameter(Mandatory = $true)]
    [string]$Username,
    [Parameter(Mandatory = $true)]
    [SecureString]$Password
)

# Convertir SecureString a texto plano
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Generar hash de la contraseña
$PasswordHash = [BCrypt.Net.BCrypt]::HashPassword($PlainPassword)

# La contraseña se limpia inmediatamente para minimizar la exposición en memoria.
Remove-Variable PlainPassword

# Detectar entorno y cargar connection string
if ($env:ASPNETCORE_ENVIRONMENT -eq "Production") {
    $configPath = "..\config\secrets\production\ProyectHub.Api.appsettings.json"
}
else {
    $configPath = "..\config\secrets\local\ProyectHub.Api.appsettings.json"
}

# Leer connection string del archivo JSON
$json = Get-Content $configPath -Raw | ConvertFrom-Json
$connectionString = $json.ConnectionStrings.DefaultConnection

$query = "INSERT INTO Users (Username, PasswordHash) VALUES (@Username, @PasswordHash)"

$connection = New-Object System.Data.SqlClient.SqlConnection $connectionString
$command = $connection.CreateCommand()
$command.CommandText = $query
$command.Parameters.Add((New-Object Data.SqlClient.SqlParameter("@Username", $Username))) | Out-Null
$command.Parameters.Add((New-Object Data.SqlClient.SqlParameter("@PasswordHash", $PasswordHash))) | Out-Null

$connection.Open()
$rows = $command.ExecuteNonQuery()
$connection.Close()

if ($rows -gt 0) {
    Write-Host "Usuario creado correctamente: $Username"
}
else {
    Write-Host "Error al crear el usuario."
}
