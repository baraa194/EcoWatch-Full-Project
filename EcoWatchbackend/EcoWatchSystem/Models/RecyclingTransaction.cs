using EcoWatchSystem.Enums;

namespace EcoWatchSystem.Models
{
    public class RecyclingTransaction
    {
        public int Id { get; set; }
        public int totalWeight {  get; set; }  
        public DateTime Createdat { get; set; }

        public RecyclingCompany Company { get; set; }
        public int CompanyId {  get; set; }
        public ApplicationUser User { get; set; }
        public string UserId {  get; set; }

        public Contract _contract { get; set; }
        public int _contractId { get; set; }
        public RecyclingStatus Status { get; set; } = RecyclingStatus.Pending;

        public List<RecyclingItem> Items { get; set; }


    }
}
