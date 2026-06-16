using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using EcoWatchSystem.Enums;
using Microsoft.AspNetCore.Components.Sections;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using EcoWatchSystem.Data;

namespace EcoWatchSystem.Services
{

    public interface IRecyclingTransactionService
    {
        public Task<int> AddRecyclingTransaction(RecyclingTransactionDTO transactionDTO);
        public Task<RecyclingTransactionDTO> GetTransactionDTO(int transactionId);
        public Task<List<RecyclingTransactionDTO>> GetTransactions();
        public Task<List<RecyclingTransactionFroAdminDTO>> GetTransactionsForAdmin();
        public Task ChangeRecyclingStatusByAdmin(int transactionId, bool approve);

    }

    public class RecyclingTransactionService : IRecyclingTransactionService
    {

        private IRecyclingTransactionRepo transactionrepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private IRecyclingCompanyRepo companyrepo;
        private IContractRepository contractrepo;
        private ILogger<RecyclingTransactionService> logger;
        private IHttpContextAccessor httpContextAccessor;
        private AppDbContext _context;
        public RecyclingTransactionService(IRecyclingTransactionRepo transactionrepo,
            UserManager<ApplicationUser> _userManager,
            IRecyclingCompanyRepo companyrepo
            , IContractRepository contractrepo
            , ILogger<RecyclingTransactionService> logger, IHttpContextAccessor httpContextAccessor, AppDbContext context)
        
        {
            this.transactionrepo = transactionrepo; 
            this._userManager = _userManager;
            this.companyrepo = companyrepo;
            this.contractrepo = contractrepo;
            this.logger = logger;
            this.httpContextAccessor = httpContextAccessor;
            this._context= context;
        }
        public async Task<int> AddRecyclingTransaction(RecyclingTransactionDTO transactionDTO)
        {
            var userId = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User not authenticated");

            var contract = await contractrepo.getbyId(transactionDTO.ContractId);

            if (contract == null)
                throw new Exception("Contract not found");

            if (contract.UserId != userId)
                throw new UnauthorizedAccessException("This contract does not belong to the user");

            var materials = await _context.Materials.ToListAsync();

            var transaction = new RecyclingTransaction
            {
                totalWeight = transactionDTO.totalWeight,
                Createdat = DateTime.UtcNow,
                UserId = userId,
                CompanyId = contract.CompanyId,
                _contractId = contract.Id,
                Items = new List<RecyclingItem>()
            };

            foreach (var itemDTO in transactionDTO.Items)
            {
                var normalizedName = itemDTO.MaterialType.Trim().ToLower();
                var material = materials.FirstOrDefault(m =>
              m.Name.Trim().ToLower() == normalizedName
                         );

                if (material == null)
                {
                    material = materials.FirstOrDefault(m => m.Name.Trim().ToLower() == "other");
                    if (material == null) continue; 
                }

                var recyclingItem = new RecyclingItem
                {
                    WeightKG = itemDTO.WeightKG,
                    MaterialType = itemDTO.MaterialType,
                    MaterialId = material.Id
                };

                transaction.Items.Add(recyclingItem);
            }

            await transactionrepo.AddTransaction(transaction);
            return transaction.Id;
        }

        public async Task<RecyclingTransactionDTO> GetTransactionDTO(int transactionId)
        {
          var transaction=await transactionrepo.GetTransaction(transactionId);
            var transactiondto=new RecyclingTransactionDTO();
            transactiondto.totalWeight = transaction.totalWeight;
            transactiondto.Createdat = transaction.Createdat;
            transactiondto.Items = transaction.Items.Select(
                i => new RecyclingItemDTO
                {
                    WeightKG = i.WeightKG,
                    MaterialType = i.MaterialType,

                } ).ToList();
            return transactiondto;
        }

        public async Task<List<RecyclingTransactionDTO>> GetTransactions()
        {
            var transactionList=await transactionrepo.GetAllTransactions();
            var transactiondtoList = transactionList.Select(transaction => new RecyclingTransactionDTO
            {
               
                totalWeight = transaction.totalWeight,
                Createdat = transaction.Createdat,
                Items = transaction.Items.Select(i => new RecyclingItemDTO
                {

                    WeightKG = i.WeightKG,
                    MaterialType = i.MaterialType,
                }).ToList()
            }).ToList();
            return transactiondtoList;
        }

        public async Task ChangeRecyclingStatusByAdmin(int transactionId, bool approve)
        {
            var transaction = await transactionrepo.GetTransaction(transactionId);
            if (transaction == null)
                throw new Exception("Transaction not found");

            transaction.Status = approve
                ? RecyclingStatus.Approved
                : RecyclingStatus.Cancelled;

            await _context.SaveChangesAsync();
        }

        public async Task<List<RecyclingTransactionFroAdminDTO>> GetTransactionsForAdmin()
        {
            return await _context.RecyclingTransactions
                   .Include(t => t.User)
        .Select(t => new RecyclingTransactionFroAdminDTO
        {
            Id = t.Id,
            ContractId = t._contractId,
            totalWeight = t.totalWeight,
            status = t.Status,
            Createdat = t.Createdat,
          
        })
        .ToListAsync();

        }
    }
}
