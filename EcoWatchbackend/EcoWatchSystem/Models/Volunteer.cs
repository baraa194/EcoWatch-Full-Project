namespace EcoWatchSystem.Models
{
    public class Volunteer
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Approved"; // Pending, Approved, Rejected, Suspended

        public int TotalTasksCompleted { get; set; } = 0;
        public int TotalHours { get; set; } = 0;
        public int ImpactScore { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        // for future
        public string? PreferredAreas { get; set; }
    }
}
