using System.Collections.Generic;

namespace EcoWatchSystem.DTO
{
    // DTO for creating a new environmental report
    // Contains user-submitted data like title, description, and location 
    public class ReportRequest
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Category { get; set; } = default!;
        public string Region { get; set; }
        public List<string>? AttachmentUrls { get; set; }
    }
}
