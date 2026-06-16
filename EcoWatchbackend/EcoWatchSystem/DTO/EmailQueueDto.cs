namespace EcoWatchSystem.DTO
{
    // DTO for queuing an email to be sent
    // Links an email to a specific report and authority

    public class EmailQueueDto
    {
        public int Id { get; set; }
        public string Recipient { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Status { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public int reportId {  get; set; }  


        public string? ReportTitle { get; set; }       
        public string? AuthorityName { get; set; }
    }
}
