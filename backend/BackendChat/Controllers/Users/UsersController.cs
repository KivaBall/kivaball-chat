using BackendChat.Entities;
using BackendChat.Services.Authentication;
using BackendChat.Services.Encryption;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendChat.Controllers.Users;

[ApiController]
[Route("api/users")]
public sealed class UsersController : ControllerBase
{
    private readonly ChatDbContext _context;
    private readonly IEncryptService _encryptService;
    private readonly IJwtAuthService _jwtAuthService;

    public UsersController(
        ChatDbContext context,
        IJwtAuthService jwtAuthService,
        IEncryptService encryptService)
    {
        _context = context;
        _jwtAuthService = jwtAuthService;
        _encryptService = encryptService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRequest request)
    {
        if (request.Username.Length > 32)
        {
            return BadRequest("Username cannot be longer than 32 characters");
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (existingUser != null)
        {
            return BadRequest("This username is already taken");
        }

        var user = new User
        {
            Username = request.Username,
            HashedPassword = _encryptService.Encrypt(request.Password)
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserRequest request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (existingUser == null)
        {
            return BadRequest("This username doesn't exist");
        }

        if (!_encryptService.Check(existingUser.HashedPassword, request.Password))
        {
            return BadRequest("Password is not correct");
        }

        var token = _jwtAuthService.GenerateJwtToken(existingUser);

        return Ok(token);
    }
}