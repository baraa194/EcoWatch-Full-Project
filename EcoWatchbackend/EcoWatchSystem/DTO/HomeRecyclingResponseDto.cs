namespace EcoWatchSystem.DTO
{
    public class HomeRecyclingResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public int ContractId { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyDescription { get; set; }
        public string? CompanyCity { get; set; }
        public string? CompanyLogoUrl { get; set; }
        public string? CompanyType { get; set; }
        public string? ImageUrl { get; set; }
        public int RequestId { get; set; }
    }
}
