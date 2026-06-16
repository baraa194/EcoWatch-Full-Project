namespace EcoWatchSystem.DTO
{
    public class HomeRecyclingDto
    {
        public string MaterialType { get; set; } = string.Empty;
        public int? MaterialId { get; set; }
        public decimal WeightKG { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public DateTime? PreferredPickupTime { get; set; }
        public int? SelectedCompanyId { get; set; }
    }
}