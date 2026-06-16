using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IRecyclingTransactionRepo
    {
        public Task AddTransaction(RecyclingTransaction transaction);
        public Task RemoveTransaction(int  transactionId);
        public Task<RecyclingTransaction> GetTransaction(int transactionId);
        public Task<List<RecyclingTransaction>> GetAllTransactions();
       
    }
}
