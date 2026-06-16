using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesController : ControllerBase
    {
        private readonly IRuleService _service;

        public RulesController(IRuleService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RuleDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rules = await _service.GetAllAsync();
            return Ok(rules);
        }

        [HttpPost("test")]
        public async Task<IActionResult> Test([FromBody] RuleDto dto)
        {
            var matches = await _service.GetMatchingAsync(dto.Category);
            return Ok(matches);
        }
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleStatus(int id, [FromQuery] bool isActive)
        {
            var result = await _service.ToggleActiveAsync(id, isActive);
            if (!result) return NotFound(new { message = "Rule not found" });
            return Ok(new { message = $"Rule {(isActive ? "activated" : "deactivated")} successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound(new { message = "Rule not found" });
            return Ok(new { message = "Rule deleted successfully" });
        }
    }
}
