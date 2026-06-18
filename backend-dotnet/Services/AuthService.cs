using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Auth;
using TexTrack.Api.Data;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Services;

public record TokenResponse(string AccessToken, string TokenType, int ExpiresIn, User User);

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;
    private readonly CurrentUser _currentUser;

    public AuthService(AppDbContext db, JwtTokenService jwt, CurrentUser currentUser)
    {
        _db = db;
        _jwt = jwt;
        _currentUser = currentUser;
    }

    public async Task<TokenResponse?> LoginAsync(string email, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            return null;

        return TokenFor(user);
    }

    public async Task<TokenResponse> RegisterAsync(RegisterRequest data)
    {
        new Validator()
            .RequiredString("name", data.Name).Max("name", data.Name, 255)
            .RequiredString("email", data.Email).Email("email", data.Email)
            .RequiredString("password", data.Password)
            .Check();

        if (data.Password!.Length < 8)
            throw new ValidationException(new() { ["password"] = new[] { "The password must be at least 8 characters." } });

        if (data.PasswordConfirmation != null && data.Password != data.PasswordConfirmation)
            throw new ValidationException(new() { ["password"] = new[] { "The password confirmation does not match." } });

        if (await _db.Users.AnyAsync(u => u.Email == data.Email))
            throw new ValidationException(new() { ["email"] = new[] { "The email has already been taken." } });

        var role = data.Role ?? "production_manager";
        if (!new[] { "admin", "production_manager", "warehouse_staff", "quality_control" }.Contains(role))
            throw new ValidationException(new() { ["role"] = new[] { "The selected role is invalid." } });

        var user = new User
        {
            Name = data.Name!,
            Email = data.Email!,
            Password = BCrypt.Net.BCrypt.HashPassword(data.Password),
            Role = role,
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return TokenFor(user);
    }

    public async Task<User> MeAsync()
    {
        var id = _currentUser.Id ?? throw new NotFoundException("User not found");
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new NotFoundException("User not found");
    }

    // JWT stateless olduğundan logout sunucu tarafında işlem gerektirmez (client token'ı siler).
    public void Logout() { }

    private TokenResponse TokenFor(User user) =>
        new(_jwt.CreateToken(user), "bearer", _jwt.TtlSeconds, user);
}
