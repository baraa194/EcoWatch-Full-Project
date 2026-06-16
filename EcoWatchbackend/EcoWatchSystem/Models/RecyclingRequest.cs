using EcoWatchSystem.Enums;

namespace EcoWatchSystem.Models
{
    public class RecyclingRequest
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string ImageUrl { get; set; }
        public string Location { get; set; }

        public string? AiDetectedType { get; set; }
        public double? EstimatedWeight { get; set; }

        public int? MaterialId { get; set; }               
        public Material? Material { get; set; }           
        public RecyclingStatus Status { get; set; } = RecyclingStatus.Pending;

        public int? PointsAwarded { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
