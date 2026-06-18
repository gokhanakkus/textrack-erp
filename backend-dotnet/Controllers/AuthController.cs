using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    public AuthController(AuthService auth) => _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        new Infrastructure.Validator()
            .RequiredString("email", request.Email).Email("email", request.Email)
            .RequiredString("password", request.Password)
            .Check();

        var result = await _auth.LoginAsync(request.Email!, request.Password!);
        if (result is null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(new
        {
            access_token = result.AccessToken,
            token_type = result.TokenType,
            expires_in = result.ExpiresIn,
            user = result.User.ToDto(),
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);
        return StatusCode(201, new
        {
            access_token = result.AccessToken,
            token_type = result.TokenType,
            expires_in = result.ExpiresIn,
            user = result.User.ToDto(),
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        _auth.Logout();
        return Ok(new { message = "Successfully logged out" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _auth.MeAsync();
        return Ok(user.ToDto());
    }
}
