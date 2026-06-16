using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcoWatchSystem.Models;
using EcoWatchSystem.Data;

namespace EcoWatchSystem.Repositories
{
    public class RoutingRuleRepository : IRoutingRuleRepository
    {
        private readonly AppDbContext _db;
        public RoutingRuleRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<EmailRoutingRules>> GetAllAsync()
            => await _db.EmailRoutingRules.Include(r => r.Authority).AsNoTracking().ToListAsync();

        public async Task<EmailRoutingRules?> GetByIdAsync(int id)
        {
            return await _db.EmailRoutingRules.Include(r => r.Authority)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<EmailRoutingRules> AddAsync(EmailRoutingRules rule)
        {
            _db.EmailRoutingRules.Add(rule);
            await _db.SaveChangesAsync();
            return rule;
        }

        public async Task UpdateAsync(EmailRoutingRules rule)
        {
            _db.EmailRoutingRules.Update(rule);
            await _db.SaveChangesAsync();
        }


        public async Task<List<EmailRoutingRules>> GetMatchingRulesAsync(string category)
        {
            
            return await _db.EmailRoutingRules
                .Include(r => r.Authority)
                .Where(r => r.Category == category )
                .OrderBy(r => r.Priority)
                .ToListAsync();
        }

        public async Task<IEnumerable<EmailRoutingRules>> GetActiveByCategoryAsync(string category)
        {
            
            return await _db.EmailRoutingRules
                .Where(r => r.Category == category )
                .Include(r => r.Authority)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<bool> ToggleActiveAsync(int id, bool isActive)
        {
            var rule = await _db.EmailRoutingRules.FindAsync(id);
            if (rule == null) return false;

            rule.IsActive = isActive;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rule = await _db.EmailRoutingRules.FindAsync(id);
            if (rule == null)
                return false;

            _db.EmailRoutingRules.Remove(rule);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
