using AutoMapper;
using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

namespace EcoWatchSystem.Services
{
    public interface IRecyclingService
    {
        public List<RecyclingItemDTO> GetMaterialsWithWeight
         (List<FilterRecyclingDetection> detections);
        public  Task<List<int>> BuildTransactionFromDetections
          (List<FilterRecyclingDetection> detections, string userId);
        public Task<Models.Contract> GetOrCreateContract(string userId, int companyId);
   
      
    }

    public class RecyclingService : IRecyclingService
    {
        private readonly AppDbContext _context;
        private readonly IRecyclingRepository _repository;
        private readonly IMLService _mlService;
        private readonly IContractRepository _contractRepo;
        private readonly IRecyclingCompanyRepo _companyRepo;
        private readonly IMapper _mapper;
        private readonly IFilterService _filterService;
        private readonly IRecyclingTransactionService _transactionService;


        public RecyclingService(
            IRecyclingRepository repository,
            IMLService mlService,
            IMapper mapper,
            AppDbContext context,
            IContractRepository contractRepo,
            IRecyclingCompanyRepo companyRepo,
            IFilterService filterService, IRecyclingTransactionService _transactionService)
        {
            _repository = repository;
            _mlService = mlService;
            _mapper = mapper;
            _context = context;
            _contractRepo = contractRepo;
            _companyRepo = companyRepo;
            _filterService = filterService;
            this._transactionService = _transactionService;

        }

        public async Task<List<int>> BuildTransactionFromDetections
     (List<FilterRecyclingDetection> detections, string userId)
        {
            var detectedMaterials = detections
                .Select(d => d.ClassName.Trim().ToLower())
                .Distinct()
                .ToList();

            int totalWeight = (int)detections.Sum(d => d.Count * 0.2);

            var companies = await _context.RecyclingCompanies
                 .Include(c => c.Materials)
                .Where(c => c.Materials.Any(m =>
                    detectedMaterials.Contains(m.Name.Trim().ToLower())))
                .ToListAsync();

            var companyGroups = companies
                .SelectMany(c => c.Materials
                    .Where(m => detectedMaterials.Contains(m.Name.Trim().ToLower()))
                    .Select(m => new { Company = c, Material = m }))
                .GroupBy(x => x.Company);
            

            var transactionIds = new List<int>(); // for all transactions

            foreach (var group in companyGroups)
            {
                var company = group.Key;
                var contract = await GetOrCreateContract(userId, company.Id);

                var items = group
                    .GroupBy(x => x.Material.Id)
                    .Select(g => new RecyclingItemDTO
                    {
                        MaterialType = g.First().Material.Name,
                        WeightKG = (int)totalWeight / detectedMaterials.Count
                    })
                    .ToList();

                var transactiondto = new RecyclingTransactionDTO
                {
                    ContractId = contract.Id,
                    Createdat = DateTime.Now,
                    totalWeight = totalWeight,
                    Items = items
                };

                var transactionId = await _transactionService.AddRecyclingTransaction(transactiondto);
                transactionIds.Add(transactionId);

              
             
            }

            return transactionIds;
        }

        public List<RecyclingItemDTO> GetMaterialsWithWeight(List<FilterRecyclingDetection> detections)
        {
            var weightPerUnit = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase)
    {
        { "Plastic",  0.10m },
        { "Paper",    0.05m },
        { "Metal",    0.20m },
        { "Organics", 0.08m }
    };

            return detections.Select(d =>
            {
                decimal unitWeight = 
                weightPerUnit.TryGetValue(d.ClassName, out decimal w) ? w : 0.10m;

                return new RecyclingItemDTO
                {
                    MaterialType = d.ClassName,
                    WeightKG = d.Count * unitWeight
                };
            }).ToList();
        }

        public async Task<Models.Contract> GetOrCreateContract(string userId, int companyId)
        {
         
            var contract = await _context.Contracts
                .FirstOrDefaultAsync(c =>
                    c.UserId == userId &&
                    c.CompanyId == companyId);

          
            if (contract != null)
                return contract;

        
            contract = new Models.Contract
            {
             UserId=userId,
             CompanyId=companyId,
              CreatedAt= DateTime.UtcNow,
            };

            await _context.Contracts.AddAsync(contract);
            await _context.SaveChangesAsync();

            return contract;
        }

       

        /***********************************************************************************************/

    }
}