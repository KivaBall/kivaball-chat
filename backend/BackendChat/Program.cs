using System.Text;
using BackendChat.Entities;
using BackendChat.Hubs;
using BackendChat.Services.Authentication;
using BackendChat.Services.Encryption;
using BackendChat.Services.Language;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseAzureSql(builder.Configuration["ConnectionStrings:Database"]));
builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["ConnectionStrings:SignalR"]);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["Frontend:Url"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidAudience = builder.Configuration["Authentication:Audience"]!,
            ValidIssuer = builder.Configuration["Authentication:Issuer"]!,
            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Authentication:EncryptKey"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSingleton<IJwtAuthService, JwtAuthService>();
builder.Services.AddSingleton<IEncryptService, EncryptService>();
builder.Services.AddSingleton<ISentimentService, SentimentService>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/api/chat");

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<ChatDbContext>();
await dbContext.Database.EnsureCreatedAsync();

await app.RunAsync();