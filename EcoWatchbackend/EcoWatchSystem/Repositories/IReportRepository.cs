using System.Collections.Generic;
using System.Threading.Tasks;
using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IReportRepository
    {
        Task<Reports> AddAsync(Reports report);
        Task<Reports?> GetByIdAsync(int id);
        Task<(IEnumerable<Reports> items, int total)> 
            GetAllAsync(int page, int pageSize, string? category, string? status, string? q);

      
        Task<(IEnumerable<Reports> items, int total)> GetUserReportsAsync(string userId, string? status, int page, int pageSize);
        Task UpdateAsync(Reports report);
    }
}
