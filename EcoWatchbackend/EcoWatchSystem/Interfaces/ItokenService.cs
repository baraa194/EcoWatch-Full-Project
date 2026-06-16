using EcoWatchSystem.Models;

namespace EcoWatchSystem.Interfaces
{
    public interface IItokenService
    {
        public Task<string> GenerateAccessToken(ApplicationUser user);
        public string GenerateRefreshToken();



    }
}
