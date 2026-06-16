using AutoMapper;
using Azure.Core;
using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Hubs;
using EcoWatchSystem.Interfaces;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Reflection;
using System.Security.Claims;

namespace EcoWatchSystem.Services
{
    // Interface defines operations for handling Reports using DTOs
    public interface IReportService
    {
        Task<ReportDetailsDto> CreateAsync(ReportRequest dto);
        Task<ReportDetailsDto?> GetByIdAsync(int id);
        Task<(IEnumerable<ReportDetailsDto> items, int total)> GetAllAsync(
            int page, int pageSize, string? category, string? status, string? q);

      
        Task<(IEnumerable<ReportSummaryForUserDto> items, int total)> GetUserReportsAsync(string userId, string? status, int page, int pageSize);
        Task<bool> UpdateStatusAsync(int reportId, string status);
    }

    public class ReportService : IReportService
    {
        private readonly IReportRepository _repo;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<NotificationHub> _hubcontext;
        private readonly IAuthoritiesReports _authorityReport;
        private readonly AIReportPredictionService _aiReportPredictionService;

        public ReportService(IReportRepository repo, IMapper mapper, 
            IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager,
            IHubContext<NotificationHub> hubcontext, IAuthoritiesReports authorityReport,
            AIReportPredictionService _aiReportPredictionService)
        {
            _repo = repo;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _hubcontext= hubcontext;   
            _authorityReport = authorityReport;
            this._aiReportPredictionService = _aiReportPredictionService;
            
        }
        
      
        public async Task<ReportDetailsDto> CreateAsync(ReportRequest dto)
        {
          
           
            var userId = _httpContextAccessor.HttpContext?
                .User?
                .FindFirst(ClaimTypes.NameIdentifier)?
                .Value;

           
            var reportEntity = _mapper.Map<Reports>(dto);
            reportEntity.UserId = userId;

          
            var mlReportDto = new MLReportRequestDto
            {
                issue_type = dto.Category,
                governorate = dto.Region,
                city = "",
                report_category = dto.Category,
                report_headline = dto.Title,
                report_detail = dto.Description
            };

           
            var prediction = await _aiReportPredictionService
                .SendReportToMl(mlReportDto);

         
            reportEntity.AiPrediction =
                prediction != null && !string.IsNullOrEmpty(prediction.final_prediction)
                    ? prediction.final_prediction.ToLower() switch
                    {
                        "true" => AiPredictionResult.Real,
                        "false" => AiPredictionResult.Fake,
                        _ => AiPredictionResult.UnKnown
                    }
                    : AiPredictionResult.UnKnown;

     
            var created = await _repo.AddAsync(reportEntity);

         
            var authReportDto = _mapper.Map<AuthorityReportDTO>(created);

            await _authorityReport.CreateAuthorityReport(authReportDto);

       
            var reportDto = _mapper.Map<ReportDetailsDto>(created);

        
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user != null)
                {
                    user.TotalPoints += 50;

                    await _userManager.UpdateAsync(user);

                    reportDto.Username = user.UserName ?? "User";
                }
            }

          
            return reportDto;
        }
     
        public async Task<ReportDetailsDto?> GetByIdAsync(int id)
        {
            var report = await _repo.GetByIdAsync(id);
            return report == null ? null : _mapper.Map<ReportDetailsDto>(report);
        }

    
        public async Task<(IEnumerable<ReportDetailsDto> items, int total)> GetAllAsync(
            int page, int pageSize, string? category, string? status, string? q)
        {
            var (items, total) = await _repo.GetAllAsync(page, pageSize, category, status, q);
            var dtoItems = items.Select(r => _mapper.Map<ReportDetailsDto>(r));
            return (dtoItems, total);
        }

     
        public async Task<(IEnumerable<ReportSummaryForUserDto> items, int total)> GetUserReportsAsync(
            string userId, string? status, int page, int pageSize)
        {
           
            var (items, total) = await _repo.GetUserReportsAsync(userId, status, page, pageSize);

            
            var dtoItems = items.Select(r => new ReportSummaryForUserDto
            {
                Id = r.Id,
                Title = r.Title,
                Status = r.Status.ToString(), 
                CreatedAt = r.CreatedAt
            });

            return (dtoItems, total);
        }

       
        public async Task<bool> UpdateStatusAsync(int reportId, string status)
        {
          
            var report = await _repo.GetByIdAsync(reportId);
            if (report == null) return false; 

            var userid = report.User.Id;

        
            if (Enum.TryParse<ReportStatus>(status, true, out var newStatus))
            {
              
                report.Status = newStatus;

             
                await _repo.UpdateAsync(report);

                if (!string.IsNullOrEmpty(userid))
                {
                    var payload = new
                    {
                        reportId=reportId,
                        status = newStatus,
                        title="Updateing Report Status ",
                        Message= $"Report with number {reportId} is {newStatus}"

                    };
                 
                   Log.Information ($"[ReportService] Sending notification to group '{userid}'" +
                       $" for report {reportId} with status {newStatus}");

                    await _hubcontext.Clients.Group(userid)
                        .SendAsync("NotifyReportStatus", payload);

                    Log.Information($"[ReportService] Notification sent to group " +
                        $"{userid} for report {reportId}");

                }


                return true;
            }

            return false;
        }

    }
}
