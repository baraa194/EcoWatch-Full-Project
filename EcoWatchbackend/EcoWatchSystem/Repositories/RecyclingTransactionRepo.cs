using EcoWatchSystem.Data;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Repositories
{
    public class RecyclingTransactionRepo : IRecyclingTransactionRepo
    {
        private AppDbContext context;
        public RecyclingTransactionRepo(AppDbContext context)
        {
            this.context = context;
        }
        public async Task AddTransaction(RecyclingTransaction transaction)
        {
            context.RecyclingTransactions.Add(transaction);
           await context.SaveChangesAsync();
            
        }

        public async Task<List<RecyclingTransaction>> GetAllTransactions()
        {
            return await context.RecyclingTransactions
                .Include(t => t.User)
                .Include(t => t.Company)
                .Include(t => t.Items).ToListAsync();
        }

        public async Task<RecyclingTransaction> GetTransaction(int transactionId)
        {
            return await context.RecyclingTransactions
                .Include(t=>t.User)
                .Include(t=>t.Company)
                .Include(t=>t.Items)
                .FirstOrDefaultAsync(t => t.Id == transactionId);
        }

        public async Task RemoveTransaction(int transactionId)
        {
            context.RecyclingTransactions.Remove(await GetTransaction(transactionId));   
            await context.SaveChangesAsync();
        }
    }
}
