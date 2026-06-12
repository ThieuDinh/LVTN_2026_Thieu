using NongSan.Application.Common;
using NongSan.Application.DTOs.Auth;

namespace NongSan.Application.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request);
}
