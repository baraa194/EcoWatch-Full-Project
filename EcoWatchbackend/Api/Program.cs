// Program.cs

using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

// --- 1. Define classes that match the JSON structure ---

// This class represents the data we SEND to the API
public class ReportData
{
    public string report_date { get; set; }
    public string governorate { get; set; }
    public string city { get; set; }
    public double longitude { get; set; }
    public double latitude { get; set; }
    public string issue_type { get; set; }
    public string report_headline { get; set; }
    public string report_detail { get; set; }
    public string report_category { get; set; }
    public int proximity_to_service { get; set; }
    public int repetition_flag { get; set; }
}

// This class represents the data we RECEIVE from the API
public class PredictionResponse
{
    public string final_prediction { get; set; }
    public Dictionary<string, double> probabilities { get; set; }
}

// --- 2. Main logic to call the API ---
class Program
{
    static async Task Main(string[] args)
    {
        // The address of our Python API server
        string apiUrl = "http://localhost:5000/predict";

        // Create an instance of HttpClient
        using (var client = new HttpClient())
        {
            try
            {
                // Create the report data object
                var reportData = new ReportData
                {
                    report_date = "2024-05-21",
                    governorate = "Cairo",
                    city = "Nasr City",
                    longitude = 31.2357,
                    latitude = 30.0444,
                    issue_type = "fire_warning",
                    report_headline = "Thick Smoke Rising from Apartment Building",
                    report_detail = "A large amount of black smoke is coming from the 5th floor of the building at 15 Tahrir St. Residents are evacuating, and there is a strong smell of burning plastic.",
                    report_category = "citizen",
                    proximity_to_service = 1,
                    repetition_flag = 0
                };

                // Serialize the object to a JSON string
                var jsonPayload = JsonSerializer.Serialize(reportData);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                Console.WriteLine("📤 Sending request to Python API...");
                
                // Send the POST request to the API
                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                // Check if the request was successful
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("✅ Received successful response from API.");
                    
                    // Read the response content
                    string responseString = await response.Content.ReadAsStringAsync();
                    
                    // Deserialize the JSON response into our C# object
                    var predictionResult = JsonSerializer.Deserialize<PredictionResponse>(responseString);

                    // Display the results
                    Console.WriteLine("\n" + "=".PadRight(50, '='));
                    Console.WriteLine($"🏆 Final Prediction: {predictionResult.final_prediction}");
                    Console.WriteLine("\n🔮 Probabilities:");
                    foreach (var prob in predictionResult.probabilities)
                    {
                        Console.WriteLine($"  - {prob.Key}: {prob.Value:P2}"); // Format as percentage
                    }
                    Console.WriteLine("=".PadRight(50, '='));
                }
                else
                {
                    Console.WriteLine($"❌ Error: {response.StatusCode}");
                    string errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Details: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An exception occurred: {ex.Message}");
            }
        }
    }
}