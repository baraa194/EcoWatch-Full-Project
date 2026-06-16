using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPointsController : ControllerBase
    {
        private IPointsService pointsService;
        public UserPointsController(IPointsService pointsService) { 
            this.pointsService = pointsService;
        }
        [HttpPost("ForUploadRecyling")]
        public async Task<IActionResult> AddPointsForUploadRecycling(int transactionid)
        {
            await pointsService.AwardPointsForRecyclingUploadsAsync(transactionid);
            Console.WriteLine("Points added");
            return Ok("Points added successfully");
        }
        [HttpPost("ForUploadRecylingWithAI")]
        public async Task<IActionResult> AddPointsForUploadRecyclingAI(List<int> transactionids)
        {
            var totalPoints = await pointsService.
                AwardPointsForRecyclingUploadsForAIAsync(transactionids);
            return Ok(totalPoints);
        }
        
        [HttpPost("ForReport")]
        public async Task<IActionResult> AddPointsForReport(int repotid)
        {
            await pointsService.AwardPointsForReportAsync(repotid);
            Console.WriteLine("Points added");
            return Ok("Points added successfully");
        }


        [HttpGet("userPoints")]
        public async Task<IActionResult> GetPointsForUploadRecycling(string userid)
        {
            var points = await pointsService.GetUserPointsAsync(userid);

            if (points == null)
                return NotFound($"User with id {userid} not found");

            return Ok(points);


        }


    }
}
