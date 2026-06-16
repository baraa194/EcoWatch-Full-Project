namespace EcoWatchSystem.Models
{
    public class EmailRoutingRules
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public int Priority { get; set; } = 100;
        public int AuthorityId { get; set; }
        public bool IsActive { get; set; } = true;

        public Authorities Authority { get; set; } = null!;
    }

}
