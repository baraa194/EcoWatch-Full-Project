using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcoWatchSystem.Models;
using EcoWatchSystem.Data;
using EcoWatchSystem.Enums;

namespace EcoWatchSystem.Repositories
{
    public class EmailQueueRepository : IEmailQueueRepository
    {
        private readonly AppDbContext _db;
        public EmailQueueRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<EmailQueue>> GetAllAsync()
        {
            return await _db.EmailQueue
        .Include(e => e.Report)
        .Include(e => e.RoutingRule)
        .ThenInclude(r => r.Authority)

        .ToListAsync();
        }

        public async Task<EmailQueue?> GetByIdAsync(int id)
            => await _db.EmailQueue.FindAsync(id);

        public async Task<EmailQueue> AddAsync(EmailQueue item)
        {
            _db.EmailQueue.Add(item);
            await _db.SaveChangesAsync();
            return item;
        }

        public async Task UpdateAsync(EmailQueue item)
        {
            _db.EmailQueue.Update(item);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _db.EmailQueue.FindAsync(id);
            if (item != null)
            {
                _db.EmailQueue.Remove(item);
                await _db.SaveChangesAsync();
            }
        }

       public async Task<List<EmailQueue>> GetPendingEmailsAsync(int batchSize)
        {
            return await _db.EmailQueue
                .Where(e => !e.Sent)
                .OrderBy(e => e.CreatedAt)
                .Take(batchSize)
                .ToListAsync();
        }
      
        public async Task MarkAttemptAsync(int emailQueueId)
        {
            var e = await _db.EmailQueue.FindAsync(emailQueueId);
            if (e == null) return;
            e.AttemptCount++;
            await _db.SaveChangesAsync();
        }

        public async Task MarkSentAsync(int emailQueueId, string auditMessage = "")
        {
            var e = await _db.EmailQueue.FindAsync(emailQueueId);
            if (e == null) return;
            e.Sent = true;
            e.SentAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _db.EmailAudit.Add(new EmailAudit
            {
                EmailQueueId = e.Id,
                SentAt = DateTime.UtcNow,
                Status = AuditStatus.Sent,
                Message = auditMessage
            });
            await _db.SaveChangesAsync();
        }

        public async Task MarkFailedAsync(int emailQueueId, string auditMessage = "")
        {
            var e = await _db.EmailQueue.FindAsync(emailQueueId);
            if (e == null) return;
            e.AttemptCount++;
            await _db.SaveChangesAsync();

            _db.EmailAudit.Add(new EmailAudit
            {
                EmailQueueId = e.Id,
                SentAt = DateTime.UtcNow,
                Status = AuditStatus.Failed,
                Message = auditMessage
            });
            await _db.SaveChangesAsync();
        }

        public async Task<Authorities?> GetAuthoritybyEmailAsync(string email)
        {
            return await _db.Authorities.FirstOrDefaultAsync(x => x.Email == email);
        }
      

    }
}
