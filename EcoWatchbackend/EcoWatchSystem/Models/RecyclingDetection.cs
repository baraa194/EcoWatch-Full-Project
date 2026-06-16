using System.Text.Json.Serialization;

namespace EcoWatchSystem.Models
{
    public class RecyclingDetection
    {
        [JsonPropertyName("class")]
        public string Class { get; set; } = string.Empty;

        [JsonPropertyName("class_id")]
        public int ClassId { get; set; }

        [JsonPropertyName("confidence")]
        public double Confidence { get; set; }

        [JsonPropertyName("detection_id")]
        public string DetectionId { get; set; } = string.Empty;
    }
}
