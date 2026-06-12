using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.Auth;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AuthResponse>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<AuthResponse>.Ok(result.Data!));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AuthResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AuthResponse>.Ok(result.Data!));
    }
}
