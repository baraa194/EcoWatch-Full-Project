using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminRecyclingController : ControllerBase
    {
        private IRecyclingTransactionService _recservice;
        public AdminRecyclingController(IRecyclingTransactionService recservice)
        {
            _recservice = recservice;
        }
        [HttpGet("all")]
        public async Task<List<RecyclingTransactionFroAdminDTO>> GetAllTransactionsForAdmin()
        {
            return await _recservice.GetTransactionsForAdmin();
        }
        [HttpPost("changeStatus/{transactionid}")]
        public async Task<IActionResult> ChangeStatus(int transactionId, [FromQuery] bool approve)
        {
            await _recservice.ChangeRecyclingStatusByAdmin(transactionId, approve);
            return Ok("Status Updated!");
        }

    }
}
