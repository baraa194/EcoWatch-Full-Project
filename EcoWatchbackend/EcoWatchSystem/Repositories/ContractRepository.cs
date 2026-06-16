using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Repositories
{
    public class ContractRepository : IContractRepository
    {
        private readonly AppDbContext _context;

        public ContractRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Contract contract)
        {
            await _context.Contracts.AddAsync(contract);
           await  _context.SaveChangesAsync();
        }

        public async Task<Contract> getbyId(int contractId)
        {
            return await _context.Contracts.FirstAsync(x => x.Id == contractId);
        }

        public async Task<List<CompanyWithUsersDto>> GetCompniesWithUsers()
        {
            return await _context.RecyclingCompanies
                .Select(c => new CompanyWithUsersDto
                {
                    CompanyId = c.Id,
                    CompanyName = c.Name,

                    Users = c.contracts
                        .Select(ct => new usersOfcompanyDTO
                        {
                            UserId = ct.User.Id,
                            UserName = ct.User.UserName,
                            Email = ct.User.Email
                        })
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<Contract> getContractby_UserId_CompanyId(int companyId, string userId)
        {
            return await _context.Contracts.FirstOrDefaultAsync
                (c => c.UserId == userId && c.CompanyId == companyId);
        }
    }
}
