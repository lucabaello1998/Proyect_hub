namespace ProyectHub.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RepositoryUrl { get; set; } = string.Empty;
        public string DemoUrl { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
    }
}
