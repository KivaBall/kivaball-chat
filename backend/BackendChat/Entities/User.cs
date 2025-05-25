namespace BackendChat.Entities;

public sealed class User
{
    public long Id { get; set; }
    public required string Username { get; set; }
    public required string HashedPassword { get; set; }
}