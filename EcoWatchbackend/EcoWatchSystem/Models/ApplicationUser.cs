using Microsoft.AspNetCore.Identity;

namespace EcoWatchSystem.Models
{
    public class ApplicationUser : IdentityUser
    {

        public string location { get; set; }
        public DateTime joinDate { get; set; }
        public int age { get; set; }
        public bool IsDeleted { get; set; } = false;
        public int TotalPoints { get; set; } = 0;

    }
}
