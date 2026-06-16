using EcoWatchSystem.DTO;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;

namespace EcoWatchSystem.Services
{
    public interface IAuthoritiesReports
    {
        public Task<ReportRoutingResult> CreateAuthorityReport(AuthorityReportDTO autorityreport);
        public Task<IEnumerable<AuthorityReportDTO>> getAuthorityReportByrule(int rule);
        public Task updateReportstatusbyreportid(int reportid, ReportStatus status);

    }



    public class AuthoritiesReports:IAuthoritiesReports
    {
       private IRoutingRuleRepository rulerepo;
        private IAuthorityReportRepo repo;
        public AuthoritiesReports(IRoutingRuleRepository rulerepo, IAuthorityReportRepo repo)
        {
            this.rulerepo = rulerepo;
            this.repo = repo;
        }

        public async Task<ReportRoutingResult> CreateAuthorityReport(AuthorityReportDTO authorityreport)
        {
            
            if (authorityreport == null || authorityreport.ReportId <= 0)
            {
                return new ReportRoutingResult
                {
                    Success = false,
                    Message = "Invalid input data"
                };
            }

            var rule = (await rulerepo
                .GetMatchingRulesAsync(authorityreport.Category))
                .FirstOrDefault();
                

            if (rule == null)
            {
                return new ReportRoutingResult
                {
                    Success = false,
                    Message = "No matching authority rule found"
                };
            }

          

           
            var entity = new AuthorityReport
            {
                ReportId = authorityreport.ReportId,
                RoutingRuleId = rule.Id,
                ReceivedAt = DateTime.UtcNow
            };

         
            await repo.AddAsync(entity);

            return new ReportRoutingResult
            {
                Success = true,
                Message = "Report routed successfully",
                AuthorityName = rule.Authority.Name
            };
        }

        public async Task<IEnumerable<AuthorityReportDTO>> getAuthorityReportByrule(int rule)
        {
            var entities=await repo.GetByRoutingRuleIdAsync(rule);
            return entities.Select(x => new AuthorityReportDTO
            {
                ReportId = x.ReportId,
                Category = x.report.Category,
                Title = x.report.Title,
                Region = x.report.Region,
                Description = x.report.Description,
                ReportStatus = x.report.Status,
                ReportDate = x.ReceivedAt
            });
        }

        public async Task updateReportstatusbyreportid(int reportid, ReportStatus status)
        {
           await repo.UpdateStatusAsync(reportid, status);

        }
    }
}
