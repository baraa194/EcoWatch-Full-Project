using EcoWatchSystem.Enums;

namespace EcoWatchSystem.Models
{
    public class AuthorityReport
    {
        public int Id { get; set; }
        public int ReportId {  get; set; }
        public Reports report { get; set; }
        public int? RoutingRuleId { get; set; }
        public EmailRoutingRules RoutingRule { get; set; }

     public DateTime ReceivedAt {  get; set; }= DateTime.Now;
    }
}
