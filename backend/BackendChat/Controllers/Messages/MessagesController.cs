using System.Globalization;
using System.Security.Claims;
using BackendChat.Entities;
using BackendChat.Hubs;
using BackendChat.Services.Language;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BackendChat.Controllers.Messages;

[ApiController]
[Route("api/messages")]
public sealed class MessagesController : ControllerBase
{
    private readonly ChatDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly ISentimentService _sentimentService;

    public MessagesController(
        ChatDbContext context,
        IHubContext<ChatHub> hubContext,
        ISentimentService sentimentService)
    {
        _context = context;
        _hubContext = hubContext;
        _sentimentService = sentimentService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateMessage(MessageRequest request)
    {
        if (request.Text.Length > 2048)
        {
            return BadRequest("Message cannot be longer than 2048 characters");
        }

        var userId = User.FindFirstValue("user_id");

        if (userId == null)
        {
            return BadRequest("Invalid JWT Token");
        }

        var message = new Message
        {
            Text = request.Text,
            TimeStamp = DateTime.UtcNow,
            ChatId = request.ChatId,
            UserId = long.Parse(userId),
            Sentiment = await _sentimentService.RetrieveTextSentimentAsync(request.Text)
        };

        _context.Messages.Add(message);

        await _context.SaveChangesAsync();

        var response = new MessageResponse
        {
            Id = message.Id,
            Text = message.Text,
            TimeStamp = message.TimeStamp.ToString(CultureInfo.InvariantCulture),
            ChatId = message.ChatId,
            UserId = message.UserId,
            Username = (await _context.Users.FindAsync(message.UserId))!.Username,
            Sentiment = message.Sentiment.ToString()
        };

        await _hubContext.Clients
            .Group($"chat_{request.ChatId}")
            .SendAsync("MessageCreated", response);

        return Ok();
    }

    [HttpGet("{chatId:long}")]
    public async Task<IActionResult> GetMessages(long chatId)
    {
        var messages = await _context.Messages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.TimeStamp)
            .Select(m => new MessageResponse
            {
                Id = m.Id,
                Text = m.Text,
                TimeStamp = m.TimeStamp.ToString(CultureInfo.InvariantCulture),
                ChatId = m.ChatId,
                UserId = m.UserId,
                Username = m.User.Username,
                Sentiment = m.Sentiment.ToString()
            })
            .ToListAsync();

        return Ok(messages);
    }
}