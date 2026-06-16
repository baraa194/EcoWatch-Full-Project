namespace EcoWatchSystem.Models
{
    public class Reward
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;           
        public int PointsRequired { get; set; }                    
        public string? Description { get; set; }                 
        public int? QuantityAvailable { get; set; }               
        public string Type { get; set; } = "Voucher";             
        public string? ImageUrl { get; set; }                      
        public bool IsActive { get; set; } = true;                
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
