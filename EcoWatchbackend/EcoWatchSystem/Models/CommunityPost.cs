using EcoWatchSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace EcoWatchSystem.Models
{
    public class CommunityPost
    {
        public int Id { get; set; }

       
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

       
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

      
        public string? ImageUrl { get; set; }

        public string Category { get; set; } = "Waste"; // Waste, Water, Cleaning, Infrastructure, Other

  
        public PostStatus Status { get; set; } = PostStatus.Pending;
   
        public int? ClaimedByVolunteerId { get; set; }
        public Volunteer? ClaimedByVolunteer { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClaimedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        // Proof of Work
        public string? BeforeImageUrl { get; set; }
        public string? AfterImageUrl { get; set; }

        public string? Notes { get; set; }

        // Verification
        public bool IsVerified { get; set; } = false;

        public string? VerifiedByUserId { get; set; }
        public ApplicationUser? VerifiedByUser { get; set; }

        public DateTime? VerifiedAt { get; set; }

        // Admin Review
        public string? RejectionReason { get; set; }

        // Rewards
        public int PointsReward { get; set; } = 10;
    }
}
