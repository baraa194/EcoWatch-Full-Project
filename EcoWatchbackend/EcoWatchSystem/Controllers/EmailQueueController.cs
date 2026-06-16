using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
    // Controller responsible for managing Email Queue (storing, viewing, and updating email statuses)
    [ApiController]
    [Route("api/[controller]")]
    public class EmailQueueController : ControllerBase
    {
        private readonly IEmailQueueService _service;

        public EmailQueueController(IEmailQueueService service)
        {
            _service = service;
        }

        // Adds a new email to the queue
        [HttpPost]
        public async Task<IActionResult> AddEmail([FromBody] EmailQueueDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Retrieves all queued emails (optionally filtered by status)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("{id}/mark-sent")]
        public async Task<IActionResult> MarkSent(int id)
        {
            await _service.MarkAsSentAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/mark-failed")]
        public async Task<IActionResult> MarkFailed(int id)
        {
            await _service.MarkAsFailedAsync(id);
            return NoContent();
        }

     
    }
}
