using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IAuthorityRepository
    {
            Task<IEnumerable<Authorities>> GetAllAsync();
            Task<Authorities?> GetByIdAsync(int id);
            Task<Authorities> AddAsync(Authorities authority); 
            Task UpdateAsync(Authorities authority);
       
        Task<bool> DeleteAsync(int id);
        Task<bool> ToggleActiveAsync(int id, bool isActive);

    }
}
