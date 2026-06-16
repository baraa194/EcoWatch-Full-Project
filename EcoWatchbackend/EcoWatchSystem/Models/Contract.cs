using Bogus.DataSets;

namespace EcoWatchSystem.Models
{
    public class Contract
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public int CompanyId { get; set; }
        public RecyclingCompany Company { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<RecyclingTransaction> TransactionList { get; set; }
    }
}
