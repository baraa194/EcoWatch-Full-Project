namespace EcoWatchSystem.DTO
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public string UserName { get; set; } = string.Empty;

        //  Claim of volunteer
        public string? ClaimedByVolunteerName { get; set; }
        public DateTime? ClaimedAt { get; set; }
    }
}
