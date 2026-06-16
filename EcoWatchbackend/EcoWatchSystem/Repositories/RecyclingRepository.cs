using EcoWatchSystem.Data;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Repositories
{
    public class RecyclingRepository : IRecyclingRepository
    {
        private readonly AppDbContext _context;

        public RecyclingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RecyclingRequest> AddAsync(RecyclingRequest item)
        {
            _context.RecyclingRequests.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<IEnumerable<RecyclingRequest>> GetAllAsync()
        {
            return await _context.RecyclingRequests
                .ToListAsync();
        }

        public async Task<IEnumerable<RecyclingRequest>> GetByUserIdAsync(string userId)
        {
            return await _context.RecyclingRequests
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
    }

}
