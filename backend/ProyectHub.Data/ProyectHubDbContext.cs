using Microsoft.EntityFrameworkCore;
using ProyectHub.Models;

namespace ProyectHub.Data
{
    public class ProyectHubDbContext : DbContext
    {
        public ProyectHubDbContext(DbContextOptions<ProyectHubDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
    }
}
