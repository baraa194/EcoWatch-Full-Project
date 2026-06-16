namespace EcoWatchSystem.Models
{
    public class RoutingHistory
    {
        public int Id { get; set; }
        public int ReportId { get; set; }
        public int AuthorityId { get; set; }
        public DateTime RoutedAt { get; set; } = DateTime.UtcNow;
        public int? RuleId { get; set; }

        public Authorities Authority { get; set; } = null!;
        public Reports Report { get; set; } = null!;
        
    }

}
