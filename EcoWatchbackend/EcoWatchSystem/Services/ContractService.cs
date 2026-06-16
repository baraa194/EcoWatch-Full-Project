using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Services
{
    public interface IContractService
    {
        Task<ContractResponseDTO> CreateContractAsync(CreateContractDTO dto);
        Task<List<CompanyWithUsersDto?>> GetCompanyWithUsersAsync();
    }
    public class ContractService:IContractService
    {
        private readonly IContractRepository _contractRepo;
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ContractService(IContractRepository contractRepo, AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _contractRepo = contractRepo;
            _context = context;
            _userManager = userManager;
        }

        public async Task<ContractResponseDTO> CreateContractAsync(CreateContractDTO dto)
        {

            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                throw new Exception($"User with Id {dto.UserId} not found");

     
            var company = await _context.RecyclingCompanies
                .FirstOrDefaultAsync(c => c.Id == dto.CompanyId);
            if (company == null)
                throw new Exception($"Company with Id {dto.CompanyId} not found");


            var existingContract = await _context.Contracts
     .AnyAsync(c => c.UserId == dto.UserId && c.CompanyId == dto.CompanyId);

            if (existingContract)
                throw new Exception("Contract already exists");

            
            var _contract = new Contract
            {
                UserId = user.Id,
                CompanyId = company.Id
            };

            await _contractRepo.AddAsync(_contract);
           

            return new ContractResponseDTO
            {
                Message = "Contract created successfully",
            };
        }

        public  Task<List<CompanyWithUsersDto?>> GetCompanyWithUsersAsync()
        {
            return  _contractRepo.GetCompniesWithUsers();
        }
    }
}
