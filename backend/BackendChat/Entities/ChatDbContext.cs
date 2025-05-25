using Microsoft.EntityFrameworkCore;

namespace BackendChat.Entities;

public sealed class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
    {
    }

    public DbSet<Chat> Chats { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chat>()
            .Property(c => c.Name)
            .HasMaxLength(32);

        modelBuilder.Entity<Message>()
            .Property(m => m.Text)
            .HasMaxLength(2048);

        modelBuilder.Entity<User>()
            .Property(u => u.Username)
            .HasMaxLength(32);

        modelBuilder.Entity<User>()
            .Property(u => u.HashedPassword)
            .HasMaxLength(64);
    }
}