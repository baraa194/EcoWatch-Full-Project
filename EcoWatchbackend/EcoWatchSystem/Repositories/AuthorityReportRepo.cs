using EcoWatchSystem.Data;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;
using Validation;

namespace EcoWatchSystem.Repositories
{
    public class AuthorityReportRepo : IAuthorityReportRepo
    {
        private AppDbContext _context;

        public AuthorityReportRepo(AppDbContext context) { 
        _context = context;
        }
        public async Task  AddAsync(AuthorityReport report)
        {
            _context.Add(report);
            _context.SaveChanges();
        }

        public async Task<List<AuthorityReport>> GetAllAsync()
        {
            return await _context.AuthorityReports
          .Include(ar => ar.report)
          .Include(ar => ar.RoutingRule)
          .ToListAsync();
        }

        public async Task<AuthorityReport?> GetByIdAsync(int id)
        {
            return await _context.AuthorityReports
            .Include(ar => ar.report)
            .Include(ar => ar.RoutingRule)
            .FirstOrDefaultAsync(ar => ar.Id == id);
        }

        public async Task<AuthorityReport?> GetByReportIdAsync(int reportId)
        {
            return await _context.AuthorityReports
              .Include(ar => ar.report)
              .FirstOrDefaultAsync(ar => ar.ReportId == reportId);
        }

        public async Task<List<AuthorityReport>> GetByRoutingRuleIdAsync(int routingRuleId)
        {
            return await _context.AuthorityReports
              .Include(ar => ar.report)
              .Where(ar => ar.RoutingRuleId == routingRuleId)
              .ToListAsync();
        }

        public async Task UpdateStatusAsync(int reportid, ReportStatus status)
        {
        
            var report = await _context.Reports.FindAsync(reportid);

            report.Status = status;

            await _context.SaveChangesAsync();

           

          
        }
    }
}
