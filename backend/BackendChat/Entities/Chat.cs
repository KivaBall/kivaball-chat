namespace BackendChat.Entities;

public sealed class Chat
{
    public long Id { get; set; }
    public required string Name { get; set; }

    public ICollection<Message> Messages { get; } = [];
}