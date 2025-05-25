using Microsoft.AspNetCore.SignalR;

namespace BackendChat.Hubs;

public sealed class ChatHub : Hub
{
    public async Task SwitchChat(long oldChatId, long newChatId)
    {
        if (oldChatId != 0)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"chat_{oldChatId}");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"chat_{newChatId}");
    }
}