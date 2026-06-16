using EcoWatchSystem.Enums;

namespace EcoWatchSystem.DTO
{
    public class RecyclingResponseDto
    {
        public int Id { get; set; }
     
        public string AiDetectedType { get; set; }
        public double? EstimatedWeight { get; set; }
        public RecyclingStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
