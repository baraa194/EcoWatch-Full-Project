using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IEmailQueueRepository
    {
        Task<IEnumerable<EmailQueue>> GetAllAsync();
        Task<EmailQueue?> GetByIdAsync(int id);
        Task<EmailQueue> AddAsync(EmailQueue item);
        Task UpdateAsync(EmailQueue item);
        Task DeleteAsync(int id);
        Task<Authorities> GetAuthoritybyEmailAsync(string email);
  
   
        Task<List<EmailQueue>> GetPendingEmailsAsync(int batchSize);
        Task MarkAttemptAsync(int emailQueueId);
        Task MarkSentAsync(int emailQueueId, string auditMessage = "");
        Task MarkFailedAsync(int emailQueueId, string auditMessage = "");
    }
}
