namespace ProyectHub.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Stack { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
        public string Images { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string DemoUrl { get; set; } = string.Empty;
        public string RepoUrl { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
