using System;

namespace ProyectHub.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Entity { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public int? EntityId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Data { get; set; }
        public string? PerformedByEmail { get; set; }
    }
}
