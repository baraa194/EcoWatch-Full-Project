namespace EcoWatchSystem.DTO
{
    public class RecyclingTransactionDTO
    {
         public int ContractId { get; set; }
        public int totalWeight { get; set; }
        public DateTime Createdat { get; set; }
        public List<RecyclingItemDTO> Items { get; set; }

    }
}
