namespace EcoWatchSystem.Models
{
    public class UserPoint
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public int Points { get; set; }

        public string SourceType { get; set; } // Report / Recycling
        public int SourceId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
