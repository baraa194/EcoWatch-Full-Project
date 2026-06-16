using Microsoft.AspNetCore.SignalR;

namespace EcoWatchSystem.Hubs
{
    public class NotificationHub:Hub
    {
        public async Task NotifyCitizen(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

    }
}
