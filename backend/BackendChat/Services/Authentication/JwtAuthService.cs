using System.Security.Claims;
using System.Text;
using BackendChat.Entities;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace BackendChat.Services.Authentication;

public sealed class JwtAuthService : IJwtAuthService
{
    private readonly IConfiguration _config;

    public JwtAuthService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateJwtToken(User user)
    {
        var key = _config["Authentication:EncryptKey"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([new Claim("user_id", user.Id.ToString())]),
            Expires = DateTime.UtcNow.AddDays(double.Parse(_config["Authentication:ExpiresDays"]!)),
            SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        };

        return new JsonWebTokenHandler().CreateToken(tokenDescriptor);
    }
}