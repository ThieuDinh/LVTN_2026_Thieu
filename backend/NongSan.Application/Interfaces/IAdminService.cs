using NongSan.Application.Common;
using NongSan.Application.DTOs.Admin;

namespace NongSan.Application.Interfaces;

public interface IAdminService
{
    Task<Result<AdminStatsResponse>> GetStatsAsync();

    // Quản lý gian hàng
    Task<Result<List<AdminShopResponse>>> GetAllShopsAsync(string? status);
    Task<Result<AdminShopResponse>> ApproveShopAsync(int shopId);
    Task<Result<AdminShopResponse>> SuspendShopAsync(int shopId);
    Task<Result<AdminShopResponse>> UpdateCommissionAsync(int shopId, UpdateCommissionRequest request);

    // Quản lý người dùng
    Task<Result<List<AdminUserResponse>>> GetAllUsersAsync(string? role);
    Task<Result<AdminUserResponse>> LockUserAsync(int userId);
    Task<Result<AdminUserResponse>> UnlockUserAsync(int userId);
}
