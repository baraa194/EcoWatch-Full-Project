namespace EcoWatchSystem.DTO
{
    public class RecyclingUploadDto
    {
        public IFormFile Image { get; set; }
        public string Location { get; set; }
        public string? Description { get; set; }
    }



}
