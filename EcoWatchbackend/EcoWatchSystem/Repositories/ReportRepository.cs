using EcoWatchSystem.Data;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace EcoWatchSystem.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;
        public ReportRepository(AppDbContext context)
        {
            _context = context;             
        }

        public async Task<Reports> AddAsync(Reports report)
        {
            _context.Add(report);
            await _context.SaveChangesAsync();
            return report;
        }

        public async Task<(IEnumerable<Reports> items, int total)> GetAllAsync(int page, int pageSize, string? category, string? status, string? q)
        {
            var query = _context.Reports.Include(r => r.User).AsQueryable();

            
            if (!string.IsNullOrEmpty(category))
                query = query.Where(r => r.Category == category);

            if (!string.IsNullOrEmpty(status))
            {
               
                if (Enum.TryParse<ReportStatus>(status, true, out var parsedStatus))
                    query = query.Where(r => r.Status == parsedStatus);
            }


            if (!string.IsNullOrEmpty(q))
                query = query.Where(r => r.Title.Contains(q) || r.Description.Contains(q));
            var total = await query.CountAsync();

            
            var items = await query
                .OrderByDescending(r => r.CreatedAt)  
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
            
                .AsNoTracking()
                .ToListAsync();

            return (items, total);

        }

        public async Task<Reports?> GetByIdAsync(int id)
        {
            var report = _context.Reports.
                Include(r=>r.User).AsNoTracking().
                FirstOrDefault(r => r.Id == id);


            return report;
        }
   
        public async Task<(IEnumerable<Reports> items, int total)> GetUserReportsAsync(string userId, string? status, int page, int pageSize)
        {
          
            IQueryable<Reports> query = _context.Reports
                .Where(r => r.UserId == userId);

            query = query.OrderByDescending(r => r.CreatedAt);

           
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ReportStatus>(status, true, out var parsedStatus))
            {
                query = query.Where(r => r.Status == parsedStatus);
            }

            var total = await query.CountAsync();

         
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking() 
                .ToListAsync();

            return (items, total);
        }

     
        public async Task UpdateAsync(Reports report)
        {
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }
    }
}
