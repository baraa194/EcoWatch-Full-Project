namespace EcoWatchSystem.DTO
{

    public class AuthorityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string ContactEmail { get; set; } = default!;
        public string? ContactPhone { get; set; }
        public string Region { get; set; } = default!;
        public bool IsActive { get; set; } = true;
    }
}
