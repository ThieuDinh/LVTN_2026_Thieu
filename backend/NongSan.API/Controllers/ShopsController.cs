using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.Shop;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShopsController : ControllerBase
{
    private readonly IShopService _shopService;

    public ShopsController(IShopService shopService)
    {
        _shopService = shopService;
    }

    /// <summary>
    /// Tạo shop mới (Buyer sẽ được nâng lên Seller)
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CreateShopRequest request)
    {
        var userId = GetUserId();
        var result = await _shopService.CreateAsync(userId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ShopResponse>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<ShopResponse>.Ok(result.Data!, "Tạo shop thành công"));
    }

    /// <summary>
    /// Cập nhật thông tin shop
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> Update(int id, UpdateShopRequest request)
    {
        var userId = GetUserId();
        var result = await _shopService.UpdateAsync(id, userId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ShopResponse>.Ok(result.Data!, "Cập nhật shop thành công"));
    }

    /// <summary>
    /// Lấy thông tin shop của mình
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyShop()
    {
        var userId = GetUserId();
        var result = await _shopService.GetMyShopAsync(userId);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ShopResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Lấy thông tin shop theo Id (public)
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _shopService.GetByIdAsync(id);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ShopResponse>.Ok(result.Data!));
    }

    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
