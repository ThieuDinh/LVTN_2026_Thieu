using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Order;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // ==================== BUYER ENDPOINTS ====================

    /// <summary>
    /// Đặt hàng (checkout từ giỏ hàng)
    /// </summary>
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(CheckoutRequest request)
    {
        var userId = GetUserId();
        var result = await _orderService.CheckoutAsync(userId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<OrderResponse>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<OrderResponse>.Ok(result.Data!, "Đặt hàng thành công"));
    }

    /// <summary>
    /// Xem chi tiết đơn hàng (Buyer)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var result = await _orderService.GetByIdAsync(id, userId);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<OrderResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<OrderResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Danh sách đơn hàng của tôi (Buyer), có thể lọc theo status
    /// </summary>
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders([FromQuery] string? status)
    {
        var userId = GetUserId();
        var result = await _orderService.GetMyOrdersAsync(userId, status);

        return Ok(ApiResponse<List<OrderResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Buyer hủy đơn hàng (chỉ khi Pending)
    /// </summary>
    [HttpPut("shop-orders/{shopOrderId}/cancel")]
    public async Task<IActionResult> CancelOrder(int shopOrderId, CancelOrderRequest request)
    {
        var userId = GetUserId();
        var result = await _orderService.CancelOrderAsync(userId, shopOrderId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Hủy đơn hàng thành công"));
    }

    /// <summary>
    /// Buyer xác nhận đã nhận hàng (Shipping → Delivered)
    /// </summary>
    [HttpPut("shop-orders/{shopOrderId}/confirm-delivered")]
    public async Task<IActionResult> ConfirmDelivered(int shopOrderId)
    {
        var userId = GetUserId();
        var result = await _orderService.ConfirmDeliveredAsync(userId, shopOrderId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Xác nhận nhận hàng thành công"));
    }

    // ==================== SELLER ENDPOINTS ====================

    /// <summary>
    /// Seller xem danh sách đơn hàng của shop (phân trang + lọc status)
    /// </summary>
    [HttpGet("seller/shops/{shopId}")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetShopOrders(
        int shopId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var sellerId = GetUserId();
        var result = await _orderService.GetShopOrdersAsync(shopId, sellerId, status, page, pageSize);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<PagedResult<ShopOrderSummaryResponse>>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<PagedResult<ShopOrderSummaryResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Seller xem chi tiết đơn hàng shop
    /// </summary>
    [HttpGet("seller/shop-orders/{shopOrderId}")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetShopOrderDetail(int shopOrderId)
    {
        var sellerId = GetUserId();
        var result = await _orderService.GetShopOrderDetailAsync(shopOrderId, sellerId);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ShopOrderDetailResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ShopOrderDetailResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Seller xác nhận đơn hàng (Pending → Confirmed)
    /// </summary>
    [HttpPut("seller/shop-orders/{shopOrderId}/confirm")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> ConfirmOrder(int shopOrderId)
    {
        var sellerId = GetUserId();
        var result = await _orderService.ConfirmOrderAsync(shopOrderId, sellerId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Xác nhận đơn hàng thành công"));
    }

    /// <summary>
    /// Seller giao hàng (Confirmed → Shipping)
    /// </summary>
    [HttpPut("seller/shop-orders/{shopOrderId}/ship")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> ShipOrder(int shopOrderId, ShipShopOrderRequest request)
    {
        var sellerId = GetUserId();
        var result = await _orderService.ShipOrderAsync(shopOrderId, sellerId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Cập nhật trạng thái giao hàng thành công"));
    }

    /// <summary>
    /// Seller hủy đơn hàng (Pending/Confirmed → Cancelled)
    /// </summary>
    [HttpPut("seller/shop-orders/{shopOrderId}/cancel")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> SellerCancelOrder(int shopOrderId, CancelOrderRequest request)
    {
        var sellerId = GetUserId();
        var result = await _orderService.SellerCancelOrderAsync(shopOrderId, sellerId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Hủy đơn hàng thành công"));
    }

    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
