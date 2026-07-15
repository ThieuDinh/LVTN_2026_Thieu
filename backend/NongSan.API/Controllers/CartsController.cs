using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.Cart;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartsController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartsController(ICartService cartService)
    {
        _cartService = cartService;
    }

    /// <summary>
    /// Lấy giỏ hàng hiện tại
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var result = await _cartService.GetCartAsync(userId);

        return Ok(ApiResponse<CartResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Thêm sản phẩm vào giỏ
    /// </summary>
    [HttpPost("items")]
    public async Task<IActionResult> AddItem(AddCartItemRequest request)
    {
        var userId = GetUserId();
        var result = await _cartService.AddItemAsync(userId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<CartResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<CartResponse>.Ok(result.Data!, "Đã thêm vào giỏ hàng"));
    }

    /// <summary>
    /// Cập nhật số lượng sản phẩm trong giỏ
    /// </summary>
    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateItem(int cartItemId, UpdateCartItemRequest request)
    {
        var userId = GetUserId();
        var result = await _cartService.UpdateItemAsync(userId, cartItemId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<CartResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<CartResponse>.Ok(result.Data!, "Cập nhật giỏ hàng thành công"));
    }

    /// <summary>
    /// Xóa sản phẩm khỏi giỏ
    /// </summary>
    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var userId = GetUserId();
        var result = await _cartService.RemoveItemAsync(userId, cartItemId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<CartResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<CartResponse>.Ok(result.Data!, "Đã xóa khỏi giỏ hàng"));
    }

    /// <summary>
    /// Xóa toàn bộ giỏ hàng
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        await _cartService.ClearCartAsync(userId);

        return Ok(ApiResponse<bool>.Ok(true, "Đã xóa toàn bộ giỏ hàng"));
    }

    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
