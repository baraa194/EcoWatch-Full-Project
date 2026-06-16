using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using Microsoft.AspNetCore.Identity;

namespace EcoWatchSystem.Services
{
    public interface IRedemptionService
    {
        Task<RedemptionResultDto> RedeemRewardAsync(string userId, int rewardId);
    }

    public class redemptionService : IRedemptionService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public redemptionService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<RedemptionResultDto> RedeemRewardAsync(string userId, int rewardId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new RedemptionResultDto { Success = false, Error = "User not found" };

            var reward = await _context.Rewards.FindAsync(rewardId);
            if (reward == null || !reward.IsActive)
                return new RedemptionResultDto { Success = false, Error = "Reward not found or inactive" };

          
            if (user.TotalPoints < reward.PointsRequired)
                return new RedemptionResultDto { Success = false, Error = "Insufficient points" };

          
            if (reward.QuantityAvailable.HasValue && reward.QuantityAvailable <= 0)
                return new RedemptionResultDto { Success = false, Error = "Reward out of stock" };

          
            user.TotalPoints -= reward.PointsRequired;

       
            string? redeemCode = null;
            if (reward.Type == "Voucher")
            {
                redeemCode = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(); 
            }

       
            var redemption = new RewardRedemption
            {
                UserId = userId,
                RewardId = rewardId,
                RedeemedPoints = reward.PointsRequired,
                RedeemCode = redeemCode,
                Status = "Pending",
                Notes = $"Redeemed on {DateTime.UtcNow:yyyy-MM-dd HH:mm}"
            };

            _context.RewardRedemptions.Add(redemption);

           
            if (reward.QuantityAvailable.HasValue)
                reward.QuantityAvailable--;

            await _context.SaveChangesAsync();
            await _userManager.UpdateAsync(user);

            return new RedemptionResultDto
            {
                Success = true,
                Message = "Reward redeemed successfully!",
                RewardName = reward.Name,
                RedeemedPoints = reward.PointsRequired,
                NewBalance = user.TotalPoints,
                RedeemCode = redeemCode
            };
        }
    }
}
