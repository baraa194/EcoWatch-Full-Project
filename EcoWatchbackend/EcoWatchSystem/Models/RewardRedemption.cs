namespace EcoWatchSystem.Models
{
    public class RewardRedemption
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;
        public int RewardId { get; set; }
        public Reward Reward { get; set; } = null!;
        public int RedeemedPoints { get; set; }               
        public DateTime RedeemDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending";         
        public string? RedeemCode { get; set; }                
        public string? Notes { get; set; }
    }
}
