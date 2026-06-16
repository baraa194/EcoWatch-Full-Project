using EcoWatchSystem.Enums;
using System;
using System.Collections.Generic;

namespace EcoWatchSystem.DTO
{
    // DTO for returning report details to client
    // Used in GET endpoints

    public class ReportDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Category { get; set; } = default!;
        public string Username {  get; set; }  
        public string Region { get; set; }
        public List<string>? AttachmentUrls { get; set; }
        public ReportStatus Status { get; set; } = default!;
        public AiPredictionResult AiPredictionResult { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
