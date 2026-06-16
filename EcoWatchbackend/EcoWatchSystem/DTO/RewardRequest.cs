namespace EcoWatchSystem.DTO
{
    public class RewardRequest
    {
        public string Name { get; set; } = string.Empty;
        public int PointsRequired { get; set; }
        public string? Description { get; set; }
        public int? QuantityAvailable { get; set; }
        public string Type { get; set; } = "Voucher";
        public IFormFile Image { get; set; }
        public bool IsActive { get; set; }
    }
}
