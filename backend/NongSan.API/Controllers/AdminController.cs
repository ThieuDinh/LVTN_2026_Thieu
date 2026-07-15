using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.Admin;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// <summary>Lấy thống kê tổng quan hệ thống</summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _adminService.GetStatsAsync();
        return Ok(ApiResponse<AdminStatsResponse>.Ok(result.Data!));
    }

    // ─── SHOP ──────────────────────────────────────────────────────────────────

    /// <summary>Danh sách tất cả gian hàng (filter theo status: Pending|Active|Suspended)</summary>
    [HttpGet("shops")]
    public async Task<IActionResult> GetShops([FromQuery] string? status)
    {
        var result = await _adminService.GetAllShopsAsync(status);
        return Ok(ApiResponse<List<AdminShopResponse>>.Ok(result.Data!));
    }

    /// <summary>Duyệt gian hàng (Pending → Active)</summary>
    [HttpPatch("shops/{id}/approve")]
    public async Task<IActionResult> ApproveShop(int id)
    {
        var result = await _adminService.ApproveShopAsync(id);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AdminShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AdminShopResponse>.Ok(result.Data!, "Duyệt gian hàng thành công"));
    }

    /// <summary>Khoá / Mở khoá gian hàng (toggle Suspended ↔ Active)</summary>
    [HttpPatch("shops/{id}/toggle-suspend")]
    public async Task<IActionResult> ToggleSuspendShop(int id)
    {
        var result = await _adminService.SuspendShopAsync(id);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AdminShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AdminShopResponse>.Ok(result.Data!, "Cập nhật trạng thái gian hàng thành công"));
    }

    /// <summary>Điều chỉnh tỷ lệ hoa hồng</summary>
    [HttpPatch("shops/{id}/commission")]
    public async Task<IActionResult> UpdateCommission(int id, UpdateCommissionRequest request)
    {
        var result = await _adminService.UpdateCommissionAsync(id, request);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AdminShopResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AdminShopResponse>.Ok(result.Data!, "Cập nhật hoa hồng thành công"));
    }

    // ─── USER ───────────────────────────────────────────────────────────────────

    /// <summary>Danh sách người dùng (filter theo role: Buyer|Seller|Admin)</summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? role)
    {
        var result = await _adminService.GetAllUsersAsync(role);
        return Ok(ApiResponse<List<AdminUserResponse>>.Ok(result.Data!));
    }

    /// <summary>Khoá tài khoản người dùng</summary>
    [HttpPatch("users/{id}/lock")]
    public async Task<IActionResult> LockUser(int id)
    {
        var result = await _adminService.LockUserAsync(id);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AdminUserResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AdminUserResponse>.Ok(result.Data!, "Đã khoá tài khoản"));
    }

    /// <summary>Mở khoá tài khoản người dùng</summary>
    [HttpPatch("users/{id}/unlock")]
    public async Task<IActionResult> UnlockUser(int id)
    {
        var result = await _adminService.UnlockUserAsync(id);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse<AdminUserResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<AdminUserResponse>.Ok(result.Data!, "Đã mở khoá tài khoản"));
    }
}
