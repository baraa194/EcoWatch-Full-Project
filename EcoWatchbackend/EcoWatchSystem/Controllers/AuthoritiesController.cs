using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]

    public class AuthoritiesController : ControllerBase
    {
        private readonly IAuthorityService _service;

        public AuthoritiesController(IAuthorityService service)
        {
            _service = service;
        }

        // Create a new Authority
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AuthorityDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Get all Authorities
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // Get Authority by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var authority = await _service.GetByIdAsync(id);
            if (authority == null)
                return NotFound();
            return Ok(authority);
        }
        // ? Delete API
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // ? Activate/Deactivate API
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleStatus(int id, [FromQuery] bool active)
        {
            var success = await _service.ToggleActiveAsync(id, active);
            if (!success) return NotFound();
            return Ok(new { Message = $"Authority {(active ? "activated" : "deactivated")} successfully." });
        }
    }
}
