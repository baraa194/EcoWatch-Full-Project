using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IRecyclingCompanyRepo
    {

         Task AddCompany(RecyclingCompany company);
        Task UpdateCompany(RecyclingCompany company);
        Task DeleteCompany(int id);
        Task<RecyclingCompany> GetCompanyById(int companyId);
        Task<List<RecyclingCompany>> GetAllCompanies();
        public Task<RecyclingCompany> GetCompanyByNameAsync(String companyname);




    }
}
