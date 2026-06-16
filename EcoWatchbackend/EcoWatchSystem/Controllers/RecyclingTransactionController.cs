using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecyclingTransactionController : ControllerBase
    {
        private IRecyclingTransactionService recyclingTransactionService;
        public RecyclingTransactionController(IRecyclingTransactionService recyclingTransactionService)
        {
            this.recyclingTransactionService = recyclingTransactionService;
        }
        [HttpPost("add")]
        public async Task<int> AddTransaction(RecyclingTransactionDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int transactionId = await recyclingTransactionService.AddRecyclingTransaction(dto);
            Console.WriteLine("Transaction added successfully");
            return transactionId;
        }
        [HttpGet("{id}")]
        public async Task<RecyclingTransactionDTO> GetTransactionById(int id)
        {
            return await recyclingTransactionService.GetTransactionDTO(id);
        }
        [HttpGet("all")]
        public async Task<List<RecyclingTransactionDTO>> GetTransactions()
        {
            return await recyclingTransactionService.GetTransactions();
        }
      
    }
}
