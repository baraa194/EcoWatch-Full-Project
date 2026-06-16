using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly IContractService _service;
        private AppDbContext _context;

        public ContractController(IContractService service,AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateContractDTO dto)
        {
            var result = await _service.CreateContractAsync(dto);
            return Ok(result);
        }

        [HttpGet("CompaniesPartnerships")]
        public async Task<ActionResult<List<CompanyWithUsersDto>>> GetCompaniesWithUsers()
        {
            return await _service.GetCompanyWithUsersAsync();
        }
        [HttpGet("GetByUserAndCompany")]
        public async Task<IActionResult> GetByUserAndCompany(int companyId)
        {
         
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var contract = await _context.Contracts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CompanyId == companyId);

            if (contract == null)
                return NotFound();

            return Ok(new { contract.Id, contract.UserId, contract.CompanyId });
        }
       
        [HttpGet("my-contracts")]
        public async Task<IActionResult> GetMyContracts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var contracts = await _context.Contracts
                .Where(c => c.UserId == userId)
                .Select(c => new {
                    c.Id,
                    c.CompanyId,
                    c.UserId

                  
                  
                    
                })
                .ToListAsync();

            return Ok(contracts);
        }
    }
}
