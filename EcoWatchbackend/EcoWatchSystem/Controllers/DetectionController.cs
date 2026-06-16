using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EcoWatchSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetectionController : ControllerBase
    {
        private readonly IMLService _mlService;
        private readonly IFilterService _filterService;
        private readonly IRecyclingService _recyclingService;
        private readonly IPointsService _pointsService;

        public DetectionController(IMLService mlService, IFilterService filterService
            ,IRecyclingService recyclingService, IPointsService pointsService)
        {
            _mlService = mlService;
            _filterService = filterService;
            _recyclingService = recyclingService;
            _pointsService = pointsService;
        }

     
        [HttpPost()]
        public async Task<IActionResult> Detect(IFormFile file)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var detections = await _mlService.GetDetectionsAsync(file);

            var summary = _filterService.GetClassSummary(detections);
            var transactionIds = await _recyclingService.BuildTransactionFromDetections
                (summary, userId);
       
        

            return Ok(transactionIds);
        }

        [HttpPost("detectionResult")]
        public async Task<IActionResult> DetectResult(IFormFile file)
        {
            var detections = await _mlService.GetDetectionsAsync(file);

            var summary = _filterService.GetClassSummary(detections);

            var recyclingitems = _recyclingService.GetMaterialsWithWeight(summary);
           

            return Ok(recyclingitems);
        }





    }
}