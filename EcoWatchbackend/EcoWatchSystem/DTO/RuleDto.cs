namespace EcoWatchSystem.DTO
{
    // DTO for defining email routing rules
    // Determines which authority receives which reports

    public class RuleDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = default!;
        public string Region { get; set; } = default!;
         public string AuthorityName {  get; set; } = default!;
        public string AuthorityEmail { get; set; } = default!;
        public int Priority { get; set; } = 1;
        public bool IsActive { get; set; } = true;
    }
}
