using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EcoWatchSystem.Controllers
{
    [ApiController]
    [Route("api/rewards")]
    public class RewardsController : ControllerBase
    {
        private readonly IRewardService _rewardService;
        private readonly IRedemptionService _redemptionService;

        public RewardsController(
            IRewardService rewardService,
            IRedemptionService redemptionService)
        {
            _rewardService = rewardService;
            _redemptionService = redemptionService;
        }

       
     
     
        [HttpGet]
        public async Task<IActionResult> GetAllRewards()
        {
            var rewards = await _rewardService.GetAllActiveRewardsAsync();
            return Ok(rewards);
        }

       
     
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRewardById(int id)
        {
            var reward = await _rewardService.GetRewardByIdAsync(id);
            if (reward == null) return NotFound("Reward not found or inactive");
            return Ok(reward);
        }

        
      
      
        [HttpPost("redeem/{rewardId}")]
     
        public async Task<IActionResult> RedeemReward(int rewardId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

            var result = await _redemptionService.RedeemRewardAsync(userId, rewardId);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

       
        [HttpGet("admin/all")]
      
        public async Task<IActionResult> GetAllRewardsForAdmin()
        {
            var rewards = await _rewardService.GetAllRewardsForAdminAsync();
            return Ok(rewards);
        }

      
        [HttpPost("admin")]
    
        public async Task<IActionResult> AddReward([FromForm] RewardRequest dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || dto.PointsRequired <= 0)
                return BadRequest("Name and PointsRequired are required");

            var created = await _rewardService.AddRewardAsync(dto);
            return CreatedAtAction(nameof(GetRewardById), new { id = created.Id }, created);
        }

     
        [HttpPut("admin/{id}")]

        public async Task<IActionResult> UpdateReward(int id, [FromBody] RewardDto dto)
        {
            var updated = await _rewardService.UpdateRewardAsync(id, dto);
            if (updated == null) return NotFound("Reward not found");
            return Ok(updated);
        }

      
        [HttpDelete("admin/{id}")]
 
        public async Task<IActionResult> DeleteReward(int id)
        {
            var deleted = await _rewardService.DeleteRewardAsync(id);
            if (!deleted) return NotFound("Reward not found");
            return Ok("Reward deactivated successfully");
        }
    }
}
