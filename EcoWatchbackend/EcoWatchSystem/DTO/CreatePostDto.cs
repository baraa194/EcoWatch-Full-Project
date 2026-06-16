namespace EcoWatchSystem.DTO
{
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
      
        public string Category { get; set; } = "Waste";
        public IFormFile? Image { get; set; }
    }
}
