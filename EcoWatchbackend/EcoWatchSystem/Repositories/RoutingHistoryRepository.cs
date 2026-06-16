using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcoWatchSystem.Models;
using EcoWatchSystem.Data;
using EcoWatchSystem.Repositories;
namespace EcoWatchSystem.Repositories
{
    public class RoutingHistoryRepository:IRoutingHistoryRepository
    {
        private readonly AppDbContext _db;
        public RoutingHistoryRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<RoutingHistory>> GetAllAsync()
            => await _db.RoutingHistory.Include(h => h.Authority).Include(h => h.Report).AsNoTracking().ToListAsync();

        public async Task<RoutingHistory?> GetByIdAsync(int id)
            => await _db.RoutingHistory.FindAsync(id);

        public async Task AddAsync(RoutingHistory history)
        {
            _db.RoutingHistory.Add(history);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(RoutingHistory history)
        {
            _db.RoutingHistory.Update(history);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _db.RoutingHistory.FindAsync(id);
            if (item != null)
            {
                _db.RoutingHistory.Remove(item);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RoutingHistory>> GetByReportIdAsync(int reportId)
        {
            return await _db.RoutingHistory
                .Where(h => h.ReportId == reportId)
                .Include(h => h.Authority)
                .Include(h => h.Report)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
