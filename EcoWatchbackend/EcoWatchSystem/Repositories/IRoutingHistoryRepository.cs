using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IRoutingHistoryRepository
    {
        Task<IEnumerable<RoutingHistory>> GetAllAsync();
        Task<RoutingHistory?> GetByIdAsync(int id);
        Task AddAsync(RoutingHistory history);
        Task UpdateAsync(RoutingHistory history);
        Task DeleteAsync(int id);

        Task<IEnumerable<RoutingHistory>> GetByReportIdAsync(int reportId);
    }
}
