using System;

namespace ProyectHub.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public int? EntityId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Details { get; set; }
        public bool Revoked { get; set; } = false;
        public int? RevokedBy { get; set; }
        public DateTime? RevokedAt { get; set; }
    }
}
