using Validation;

namespace EcoWatchSystem.Models
{
    public class EmailQueue
    {
        public int Id { get; set; }
        public int? ReportId { get; set; }     
        public Reports Report { get; set; }
        public int? RoutingRuleId { get; set; }
        public EmailRoutingRules RoutingRule { get; set; }
        public string Recipient { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public bool Sent { get; set; } = false;
        public int AttemptCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SentAt { get; set; }
      

    }

}
