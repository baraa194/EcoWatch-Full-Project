namespace EcoWatchSystem.DTO
{
    public class ReportSummaryForUserDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string Status { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
}
