using Azure.AI.TextAnalytics;

namespace BackendChat.Entities;

public sealed class Message
{
    public long Id { get; set; }
    public required string Text { get; set; }

    public DateTime TimeStamp { get; set; }
    public TextSentiment Sentiment { get; set; }

    public long UserId { get; set; }
    public User User { get; set; }

    public long ChatId { get; set; }
    public Chat Chat { get; set; }
}