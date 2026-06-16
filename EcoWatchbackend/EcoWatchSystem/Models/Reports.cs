using EcoWatchSystem.Enums;
namespace EcoWatchSystem.Models
{
    public class Reports
    {
        public int Id { get; set; }
        public string? UserId { get; set; }       
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;  
        public string Region { get; set; } = string.Empty;
        public ReportStatus Status { get; set; } = ReportStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ApplicationUser? User { get; set; }

        public AiPredictionResult AiPrediction { get; set; } = AiPredictionResult.UnKnown;

        public ICollection<ReportAttachments> Attachments { get; set; } = new List<ReportAttachments>();
        public ICollection<RoutingHistory> RoutingHistories { get; set; } = new List<RoutingHistory>();
    }

}
