using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecyclingCompanyController : ControllerBase
    {
        private readonly IRecyclingCompanyService _recyclingCompanyService;

        public RecyclingCompanyController(IRecyclingCompanyService recyclingCompanyService)
        {
            _recyclingCompanyService = recyclingCompanyService;
        }

        
        [HttpPost("add")]
        public async Task<IActionResult> AddCompany([FromForm] RecyclingCompanyDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid company data.");

            await _recyclingCompanyService.CreateCompany(dto);
            return Ok("Company added successfully.");
        }

       
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCompanies()
        {
            var companies = await _recyclingCompanyService.GetAllCompanies();
            return Ok(companies);
        }

       
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var company = await _recyclingCompanyService.GetCompanyById(id);
            if (company == null)
                return NotFound("Company not found.");
            return Ok(company);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] RecyclingCompanyDTO dto)
        {
            var existingCompany = await _recyclingCompanyService.GetCompanyById(id);
            if (existingCompany == null)
                return NotFound("Company not found.");

            await _recyclingCompanyService.UpdateCompany(dto, id);
            return Ok("Company updated successfully.");
        }

      
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var existingCompany = await _recyclingCompanyService.GetCompanyById(id);
            if (existingCompany == null)
                return NotFound("Company not found.");

            await _recyclingCompanyService.DeleteCompany(id);
            return Ok("Company deleted successfully.");
        }

       
    }
}
