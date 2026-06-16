using EcoWatchSystem.Models;
using System.Text.Json;
namespace EcoWatchSystem.Services
{
    

    public class MLService : IMLService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public MLService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<List<RecyclingDetection>> GetDetectionsAsync(IFormFile file)
        {
            var baseUrl = _config["MLApi:Url"];

            using var content = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();

            content.Add(new StreamContent(stream), "file", file.FileName);

            var response = await _httpClient.PostAsync(baseUrl, content);

            if (!response.IsSuccessStatusCode)
                throw new Exception("ML API failed");

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<RoboflowResponse>(json);

            return result?.Predictions ?? new List<RecyclingDetection>();
        }
    }
}