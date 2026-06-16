using AutoMapper;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Services
{
    public interface IEmailQueueService
    {
        Task<EmailQueueDto> CreateAsync(EmailQueueDto dto);
        Task<IEnumerable<EmailQueueDto>> GetAllAsync();
        Task<EmailQueueDto?> GetByIdAsync(int id);
        Task MarkAsSentAsync(int id);
        Task MarkAsFailedAsync(int id);

        Task SendReportEmailAsync(string recipientEmail, ReportDetailsDto report,int ruleid);
   

    }


    public class EmailQueueService : IEmailQueueService
    {
        private readonly IEmailQueueRepository _repo;
        private readonly IMapper _mapper;
        private readonly IEmailTemplateService _templateService;
        private readonly IEmailSender _emailSender;

        public EmailQueueService(IEmailQueueRepository repo, IMapper mapper , 
            IEmailTemplateService templateService, IEmailSender emailSender)
        { 
            _repo = repo;
            _mapper = mapper;
            _templateService = templateService;
            _emailSender = emailSender;
        }

        public async Task<EmailQueueDto> CreateAsync(EmailQueueDto dto)
        {
            var entity = _mapper.Map<EmailQueue>(dto);
            var created = await _repo.AddAsync(entity);
            return _mapper.Map<EmailQueueDto>(created);
        }

        public async Task<IEnumerable<EmailQueueDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(e => _mapper.Map<EmailQueueDto>(e));
        }

        public async Task<EmailQueueDto?> GetByIdAsync(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item == null ? null : _mapper.Map<EmailQueueDto>(item);
        }

        public Task MarkAsSentAsync(int id) => _repo.MarkSentAsync(id);
        public Task MarkAsFailedAsync(int id) => _repo.MarkFailedAsync(id);


        // sending email 
        public async Task SendReportEmailAsync(string recipientEmail, ReportDetailsDto report, int ruleid)
        {
          
        
            var authority=await _repo.GetAuthoritybyEmailAsync(recipientEmail);
      
          
            var (subject, bodyHtml) = _templateService.GenerateReportEmail(report);

            var emailDto = new EmailQueueDto
            {
                Recipient = recipientEmail,
                AuthorityName = authority.Name,
                ReportTitle = report.Title,
                Subject = report.Title,
                Body = report.Description,
                Status = "Sent",
                CreatedAt = DateTime.UtcNow
            };

            var entity = _mapper.Map<EmailQueue>(emailDto);
            entity.ReportId = report.Id;
            entity.Report = null;
            entity.RoutingRuleId= ruleid;
            entity.RoutingRule = null;
          
            Console.WriteLine("📬 Before Save: " + emailDto.Recipient);
            Console.Write("Rule id : "+ruleid);
            await _repo.AddAsync(entity);

            Console.WriteLine("✅ After Save - Email added to queue");
    
            await _emailSender.SendEmailAsync(recipientEmail, subject, bodyHtml);
        }
      
        
    }
}
