namespace EcoWatchSystem.Models
{
    public class Authorities
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;  // Which category this authority handles
        public bool IsActive { get; set; } = true;
        public ICollection<EmailRoutingRules> RoutingRules { get; set; } = new List<EmailRoutingRules>();
        public ICollection<RoutingHistory> RoutingHistories { get; set; } = new List<RoutingHistory>();
    }

}
