using EcoWatchSystem.Enums;

namespace EcoWatchSystem.DTO
{
    public class RecyclingTransactionFroAdminDTO
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int totalWeight { get; set; }
        public RecyclingStatus status { get; set; }
        public DateTime Createdat { get; set; }
     
    }
}
