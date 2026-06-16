namespace EcoWatchSystem.Models
{
    public class PointsTransaction
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string SourceType { get; set; }
        public string ItemType { get; set; }   
        public decimal QuantityKg { get; set; }
        public int CalculatedPoints { get; set; }
        public bool ValidationStatus { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
