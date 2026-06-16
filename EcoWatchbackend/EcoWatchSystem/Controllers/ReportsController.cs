using EcoWatchSystem.DTO;
using EcoWatchSystem.Interfaces;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Serilog;
using System.Diagnostics;
using System.Security.Claims;
using System.Text.Json;

namespace EcoWatchSystem.Controllers
{
    // Controller for managing environmental reports
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;
        private readonly JsonSerializerOptions _jsonSerializerOptions=
            new JsonSerializerOptions { PropertyNamingPolicy=JsonNamingPolicy.CamelCase };
        private readonly AIReportPredictionService _mlApiService;

       
        public ReportsController(IReportService service)
        {
            _service = service;
          
        }

        private static string BuildKey(int page, int pageSize, string? category, string? status, string? q)
            => $"reports:p={page}:ps={pageSize}:c={category ?? "-"}:s={status ?? "-"}:q={q ?? "-"}";

        // POST: api/reports
        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] ReportRequest dto)
        {

            if (dto != null) Log.Information("Reort with name {reportname} is created", dto.Title);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetReportById), new { id = created.Id }, created);
        }

        // GET: api/reports/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReportById(int id)
        {
            var report = await _service.GetByIdAsync(id);
            if (report == null) return NotFound();
            return Ok(report);
        }

        // GET: api/reports
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? status = null,
            [FromQuery] string? q = null)
        {
        
            var (items, total) = await _service.GetAllAsync(page, pageSize, category, status, q);
            return Ok(new { total, items });
        }

    
        [HttpGet("my")]
        public async Task<IActionResult> GetMyReports(
            [FromQuery] string? status = null,   
            [FromQuery] int page = 1,            
            [FromQuery] int pageSize = 10)      
        {
           
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

       
            var (items, total) = await _service.GetUserReportsAsync(userId, status, page, pageSize);

         
            return Ok(new
            {
                total,
                items,
                currentPage = page,
                pageSize = pageSize
            });
        }

      
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateReportStatusDto dto)
        {
          
            var success = await _service.UpdateStatusAsync(id, dto.Status);
            Log.Information("Broadcast test sent to the user");

            if (!success)
                return NotFound(new { message = "Report not found or invalid status" });

            return Ok(new { message = "Report status updated successfully" });
        }


        


    }
}
