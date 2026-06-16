using EcoWatchSystem.DTO;

namespace EcoWatchSystem.Services
{
    public class ReportNotificationService
    {
        private readonly IRuleService _routingService;
        private readonly IEmailQueueService _emailQueueService;
        private readonly IReportService reportservice;

        public ReportNotificationService(IRuleService routingService, 
            IEmailQueueService emailQueueService, IReportService reportservice)
        {
            _routingService = routingService;
            _emailQueueService = emailQueueService;
            this.reportservice = reportservice;
        }
      
        public async Task NotifyAuthoritiesAsync(int Reportid)
        {
            var report= await reportservice.GetByIdAsync(Reportid);
           
           
            var authorities = await _routingService.GetMatchingAsync(report.Category ??"");

        
            foreach (var rule in authorities)
            {
                await _emailQueueService.SendReportEmailAsync(rule.AuthorityEmail, report,rule.Id);
            }

        }

    }
}
