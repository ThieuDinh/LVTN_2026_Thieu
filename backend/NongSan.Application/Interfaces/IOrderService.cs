using NongSan.Application.Common;
using NongSan.Application.DTOs.Order;

namespace NongSan.Application.Interfaces;

public interface IOrderService
{
    // ========== BUYER ==========
    Task<Result<OrderResponse>> CheckoutAsync(int userId, CheckoutRequest request);
    Task<Result<OrderResponse>> GetByIdAsync(int orderId, int userId);
    Task<Result<List<OrderResponse>>> GetMyOrdersAsync(int userId, string? status = null);
    Task<Result<bool>> CancelOrderAsync(int userId, int shopOrderId, CancelOrderRequest request);
    Task<Result<bool>> ConfirmDeliveredAsync(int userId, int shopOrderId);

    // ========== SELLER ==========
    Task<Result<PagedResult<ShopOrderSummaryResponse>>> GetShopOrdersAsync(
        int shopId, int sellerId, string? status, int page, int pageSize);
    Task<Result<ShopOrderDetailResponse>> GetShopOrderDetailAsync(int shopOrderId, int sellerId);
    Task<Result<bool>> ConfirmOrderAsync(int shopOrderId, int sellerId);
    Task<Result<bool>> ShipOrderAsync(int shopOrderId, int sellerId, ShipShopOrderRequest request);
    Task<Result<bool>> SellerCancelOrderAsync(int shopOrderId, int sellerId, CancelOrderRequest request);
}
