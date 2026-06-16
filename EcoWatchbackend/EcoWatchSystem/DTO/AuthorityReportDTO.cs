using EcoWatchSystem.Enums;

namespace EcoWatchSystem.DTO
{
    public class AuthorityReportDTO
    {
        public int ReportId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Region { get; set; } 
        public ReportStatus ReportStatus { get; set; }
        public DateTime ReportDate { get; set; }
    }
}
