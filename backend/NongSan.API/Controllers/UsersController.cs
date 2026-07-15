using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NongSan.API.Common;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IAppDbContext _context;

    public UsersController(IAppDbContext context)
    {
        _context = context;
    }

    // ── Profile ──────────────────────────────────────────────

    public record ProfileResponse(int Id, string FullName, string Email, string? Phone, string? Avatar, string Role);
    public record UpdateProfileRequest(string FullName, string? Phone, string? Avatar);

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse<ProfileResponse>.Ok(new ProfileResponse(
            user.Id, user.FullName, user.Email, user.Phone, user.Avatar, user.Role.ToString())));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy người dùng"));

        user.FullName = request.FullName.Trim();
        user.Phone = request.Phone?.Trim();
        user.Avatar = request.Avatar?.Trim();
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<ProfileResponse>.Ok(new ProfileResponse(
            user.Id, user.FullName, user.Email, user.Phone, user.Avatar, user.Role.ToString()),
            "Cập nhật hồ sơ thành công"));
    }

    // ── Addresses ────────────────────────────────────────────

    public record AddressResponse(int Id, string ReceiverName, string Phone, string Province,
        string District, string Ward, string Detail, bool IsDefault);
    public record CreateAddressRequest(string ReceiverName, string Phone, string Province,
        string District, string Ward, string Detail, bool IsDefault);
    public record UpdateAddressRequest(string ReceiverName, string Phone, string Province,
        string District, string Ward, string Detail, bool IsDefault);

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = GetUserId();
        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .Select(a => new AddressResponse(a.Id, a.ReceiverName, a.Phone, a.Province,
                a.District, a.Ward, a.Detail, a.IsDefault))
            .ToListAsync();

        return Ok(ApiResponse<List<AddressResponse>>.Ok(addresses));
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> CreateAddress(CreateAddressRequest request)
    {
        var userId = GetUserId();

        if (request.IsDefault)
        {
            var existing = await _context.Addresses
                .Where(a => a.UserId == userId && a.IsDefault)
                .ToListAsync();
            foreach (var a in existing) a.IsDefault = false;
        }

        var address = new Domain.Entities.Address
        {
            UserId = userId,
            ReceiverName = request.ReceiverName.Trim(),
            Phone = request.Phone.Trim(),
            Province = request.Province.Trim(),
            District = request.District.Trim(),
            Ward = request.Ward.Trim(),
            Detail = request.Detail.Trim(),
            IsDefault = request.IsDefault
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return Created("", ApiResponse<AddressResponse>.Ok(
            new AddressResponse(address.Id, address.ReceiverName, address.Phone, address.Province,
                address.District, address.Ward, address.Detail, address.IsDefault),
            "Thêm địa chỉ thành công"));
    }

    [HttpPut("addresses/{id}")]
    public async Task<IActionResult> UpdateAddress(int id, UpdateAddressRequest request)
    {
        var userId = GetUserId();
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (address == null)
            return NotFound(ApiResponse<object>.Fail("Địa chỉ không tồn tại"));

        if (request.IsDefault)
        {
            var existing = await _context.Addresses
                .Where(a => a.UserId == userId && a.IsDefault && a.Id != id)
                .ToListAsync();
            foreach (var a in existing) a.IsDefault = false;
        }

        address.ReceiverName = request.ReceiverName.Trim();
        address.Phone = request.Phone.Trim();
        address.Province = request.Province.Trim();
        address.District = request.District.Trim();
        address.Ward = request.Ward.Trim();
        address.Detail = request.Detail.Trim();
        address.IsDefault = request.IsDefault;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<AddressResponse>.Ok(
            new AddressResponse(address.Id, address.ReceiverName, address.Phone, address.Province,
                address.District, address.Ward, address.Detail, address.IsDefault),
            "Cập nhật địa chỉ thành công"));
    }

    [HttpDelete("addresses/{id}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var userId = GetUserId();
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (address == null)
            return NotFound(ApiResponse<object>.Fail("Địa chỉ không tồn tại"));

        address.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Ok(true, "Xoá địa chỉ thành công"));
    }

    private int GetUserId()
        => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
}
