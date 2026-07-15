using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.Subscription;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    /// <summary>
    /// Lấy danh sách tất cả gói đăng ký (public)
    /// </summary>
    [HttpGet("subscription-plans")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPlans()
    {
        var result = await _subscriptionService.GetAllPlansAsync();
        return Ok(ApiResponse<List<SubscriptionPlanDto>>.Ok(result.Data!));
    }

    /// <summary>
    /// Lấy gói đăng ký hiện tại của shop (Seller auth)
    /// </summary>
    [HttpGet("shops/{shopId}/subscription")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetCurrentSubscription(int shopId)
    {
        var result = await _subscriptionService.GetCurrentSubscriptionAsync(shopId);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ShopSubscriptionDto>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ShopSubscriptionDto>.Ok(result.Data!));
    }

    /// <summary>
    /// Đăng ký gói cho shop (Seller auth)
    /// </summary>
    [HttpPost("shops/{shopId}/subscription")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> Register(int shopId, RegisterShopSubscriptionRequest request)
    {
        request.ShopId = shopId;
        var result = await _subscriptionService.RegisterAsync(request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ShopSubscriptionDto>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<ShopSubscriptionDto>.Ok(result.Data!, "Đăng ký gói thành công"));
    }
}
