using System.Diagnostics.Contracts;

namespace EcoWatchSystem.Models
{
    public class RecyclingCompany
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string email {  get; set; }
        public string phone { get; set; }
        public string city { get; set; }
        public string logo_url {  get; set; }
        public string Registration_Number {  get; set; }
        public ICollection<Material> Materials { get; set; }
    
        public List<Contract> contracts { get; set; }

     
       public List<ApplicationUser> users { get; set; }

        // one to many with Recycling item

        public List<RecyclingItem> recyclingitems { get; set; }
        


    }
}
