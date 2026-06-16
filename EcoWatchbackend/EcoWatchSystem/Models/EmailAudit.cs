using EcoWatchSystem.Enums;

namespace EcoWatchSystem.Models
{
    public class EmailAudit
    {
        public int Id { get; set; }
        public int EmailQueueId { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public string Message { get; set; } = string.Empty;

        public EmailQueue EmailQueue { get; set; } = null!;
        public AuditStatus Status { get; set; } = AuditStatus.Sent;
    }

}
