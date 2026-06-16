namespace EcoWatchSystem.DTO
{
    public class CompletePostDto
    {
        public IFormFile? AfterImage { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
