using EcoWatchSystem.DTO;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;

namespace EcoWatchSystem.Services
{
    public class AIReportPredictionService
    {
        private readonly HttpClient _httpClient;
        private readonly string _mlApiUrl = "http://127.0.0.1:5000/predict"; 

        public AIReportPredictionService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<MLPredictionResponseDto?> SendReportToMl(MLReportRequestDto request)
        {
            try
            {
                
                var jsonPayload = JsonSerializer.Serialize(request);

            
                Console.WriteLine("🔹 Sending JSON to ML API:\n" + jsonPayload);

                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

             
                var response = await _httpClient.PostAsync(_mlApiUrl, content);

             
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ ML API Error: {response.StatusCode}\nBody: {errorBody}");
                    return null;
                }

            
                var responseString = await response.Content.ReadAsStringAsync();

              
                Console.WriteLine("🔹 Received response from ML API:\n" + responseString);

             
                return JsonSerializer.Deserialize<MLPredictionResponseDto>(responseString);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"❌ HTTP request failed: {ex.Message}");
                return null;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"❌ JSON serialization/deserialization failed: {ex.Message}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Unexpected error: {ex.Message}");
                return null;
            }
        }
    }
}
