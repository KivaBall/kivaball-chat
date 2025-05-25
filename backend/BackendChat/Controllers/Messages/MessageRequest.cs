namespace BackendChat.Controllers.Messages;

public sealed class MessageRequest
{
    public required string Text { get; set; }
    public required long ChatId { get; set; }
}