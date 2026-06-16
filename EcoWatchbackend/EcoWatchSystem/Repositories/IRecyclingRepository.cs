using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IRecyclingRepository
    {
        Task<RecyclingRequest> AddAsync(RecyclingRequest item);
        Task<IEnumerable<RecyclingRequest>> GetAllAsync();
        Task<IEnumerable<RecyclingRequest>> GetByUserIdAsync(string userId);
    }

}
