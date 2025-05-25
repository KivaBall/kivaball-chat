using BackendChat.Entities;

namespace BackendChat.Services.Authentication;

public interface IJwtAuthService
{
    string GenerateJwtToken(User user);
}