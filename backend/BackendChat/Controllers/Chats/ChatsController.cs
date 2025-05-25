using BackendChat.Entities;
using BackendChat.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BackendChat.Controllers.Chats;

[ApiController]
[Route("api/chats")]
public sealed class ChatsController : ControllerBase
{
    private readonly ChatDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatsController(ChatDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateChat(ChatRequest request)
    {
        if (request.Name.Length > 32)
        {
            return BadRequest("Name cannot be longer than 32 characters");
        }

        var chat = new Chat
        {
            Name = request.Name
        };

        _context.Chats.Add(chat);

        await _context.SaveChangesAsync();

        var response = new ChatResponse
        {
            Id = chat.Id,
            Name = chat.Name
        };

        await _hubContext.Clients.All.SendAsync("ChatCreated", response);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetChats()
    {
        var chats = await _context.Chats
            .Select(c => new ChatResponse
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(chats);
    }
}