using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IContractRepository
    {
        public Task AddAsync(Contract contract);
        public Task<Contract> getContractby_UserId_CompanyId(int companyId,string userId);
        public Task<List<CompanyWithUsersDto?>> GetCompniesWithUsers();
        public Task<Contract> getbyId(int contractId);
    }
}
