using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IAuthorityReportRepo
    {
       public Task AddAsync(AuthorityReport report);
       public Task<List<AuthorityReport>> GetAllAsync();
       public Task<AuthorityReport?> GetByIdAsync(int id);
       public Task<AuthorityReport?> GetByReportIdAsync(int reportId);
       public Task<List<AuthorityReport>> GetByRoutingRuleIdAsync(int routingRuleId);
       public Task UpdateStatusAsync(int Reportid, ReportStatus status);
    }
}
