﻿namespace BackendChat.Controllers.Users;

public sealed class UserRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}