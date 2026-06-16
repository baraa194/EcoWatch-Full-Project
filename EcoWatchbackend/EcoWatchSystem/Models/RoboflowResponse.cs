using System.Text.Json.Serialization;

namespace EcoWatchSystem.Models
{
    public class RoboflowResponse
    {
        [JsonPropertyName("predictions")]
        public List<RecyclingDetection> Predictions { get; set; } = new();
    }
}