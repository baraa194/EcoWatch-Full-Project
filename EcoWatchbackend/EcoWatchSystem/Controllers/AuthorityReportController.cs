using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorityReportController : ControllerBase
    {
        private IAuthoritiesReports _authReport;
        public AuthorityReportController(IAuthoritiesReports authReport)
        {
            _authReport = authReport;
        }
        [HttpGet("Byrule/{ruleid}")]
        public async Task<IActionResult> GetuthReportsByrule(int ruleid)
        {
            var reports= await _authReport.getAuthorityReportByrule(ruleid);
            return Ok(reports);
        }
        [HttpPost("updateStatus/{reportid}/{status}")]
        public async Task <IActionResult> UpdateReportStatus(int reportid, ReportStatus status)
        {
            await _authReport.updateReportstatusbyreportid(reportid, status);
            return Ok("Status Updated!!");
        }
    }
}
