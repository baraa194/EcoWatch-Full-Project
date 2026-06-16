namespace EcoWatchSystem.DTO
{
    public class RecyclingCompanyResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string city { get; set; }
        public string Logo_url { get; set; }
        public List<string> MaterialNames { get; set; }
        public string Registration_Number { get; set; }
    }
}
