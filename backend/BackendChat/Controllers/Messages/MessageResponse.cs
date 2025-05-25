namespace BackendChat.Controllers.Messages;

public sealed class MessageResponse
{
    public required long Id { get; set; }
    public required string Text { get; set; }
    public required string TimeStamp { get; set; }
    public required long UserId { get; set; }
    public required string Username { get; set; }
    public required long ChatId { get; set; }
    public required string Sentiment { get; set; }
}