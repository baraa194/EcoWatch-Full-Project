using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportNotificationController : ControllerBase
    {
        private readonly ReportNotificationService reportNotification;

        public ReportNotificationController(ReportNotificationService reportNotification)
        {
            this.reportNotification = reportNotification;
        }

        [HttpGet("SendMailToAuthorityWithReportId/{Reportid}")]
        public async Task<IActionResult> SendMailsToAuthorities(int Reportid)
         {
            if (Reportid == null)
            {
                Log.Error("Report With  Id {Reportid}  is not exist", Reportid);
                return BadRequest("Cannot Send the Email");
            }
            else
            {
                await reportNotification.NotifyAuthoritiesAsync(Reportid);
                Log.Information("Report With  Id {Reportid}  is sent to Authority", Reportid);
                return Ok("The Email is sent To Authority");

            }
           

         }


    }
}
