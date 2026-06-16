using Azure.Identity;

namespace EcoWatchSystem.Models
{
    public class RecyclingItem
    {
        public int Id { get; set; }
        public string MaterialType { get; set; }
        public decimal WeightKG { get; set; }
        public RecyclingTransaction transaction { get; set; }
        public int transactionId {  get; set; }
        public int MaterialId { get; set; }        
        public Material Material { get; set; }
    }
}
