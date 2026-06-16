namespace EcoWatchSystem.DTO
{
    public class RedemptionResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? RewardName { get; set; }
        public int RedeemedPoints { get; set; }
        public int NewBalance { get; set; }
        public string? RedeemCode { get; set; } 
        public string? Error { get; set; }
    }
}
