namespace EcoWatchSystem.DTO
{
    public class AdminCommunityPostDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
        public string? BeforeImageUrl { get; set; }
        public string? AfterImageUrl { get; set; }

        public string? Notes { get; set; }

        public int PointsReward { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int? ClaimedByVolunteerId { get; set; }
        public string? ClaimedByVolunteerUserId { get; set; }
        public string? ClaimedByVolunteerName { get; set; }
        public int? VolunteerImpactScore { get; set; }

        public bool IsVerified { get; set; }

        public string? VerifiedByUserId { get; set; }
        public string? RejectionReason { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ClaimedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}
