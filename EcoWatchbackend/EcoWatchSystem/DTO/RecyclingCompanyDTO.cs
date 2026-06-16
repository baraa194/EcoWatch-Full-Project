namespace EcoWatchSystem.DTO
{
    public class RecyclingCompanyDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string city { get; set; }
        public IFormFile Logo { get; set; }
        public List<int> MaterialIds { get; set; }
        public string Registration_Number { get; set; }
    }
}
