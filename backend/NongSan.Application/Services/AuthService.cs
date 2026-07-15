using Microsoft.EntityFrameworkCore;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Auth;
using NongSan.Application.Interfaces;
using NongSan.Domain.Entities;
using NongSan.Domain.Enums;

namespace NongSan.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(IAppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        // Kiểm tra email đã tồn tại chưa
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email.ToLower());

        if (emailExists)
            return Result<AuthResponse>.Fail("Email đã được sử dụng.");

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Phone = request.Phone?.Trim(),
            Role = UserRole.Buyer,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Tạo Cart cho Buyer mới
        var cart = new Cart { UserId = user.Id };
        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        return Result<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = token,
            ExpiresAt = _tokenService.GetExpiryDate()
        });
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Shop)
            .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

        if (user == null)
            return Result<AuthResponse>.Fail("Email hoặc mật khẩu không đúng.");

        if (!user.IsActive)
            return Result<AuthResponse>.Fail("Tài khoản đã bị khoá.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Result<AuthResponse>.Fail("Email hoặc mật khẩu không đúng.");

        var token = _tokenService.GenerateToken(user);

        return Result<AuthResponse>.Ok(new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = token,
            ExpiresAt = _tokenService.GetExpiryDate(),
            ShopId = user.Shop?.Id
        });
    }
}
