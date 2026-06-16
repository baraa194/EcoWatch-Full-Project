namespace EcoWatchSystem.DTO
{
    public class MLPredictionResponseDto
    {
        public string final_prediction { get; set; }
        public Dictionary<string, double> probabilities { get; set; }
    }
}
