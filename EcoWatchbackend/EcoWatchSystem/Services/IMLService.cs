using EcoWatchSystem.Models;

public interface IMLService
{
    Task<List<RecyclingDetection>> GetDetectionsAsync(IFormFile imageUrl);
}