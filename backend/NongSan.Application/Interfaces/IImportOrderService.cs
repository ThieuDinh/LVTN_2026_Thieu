using NongSan.Application.Common;
using NongSan.Application.DTOs.ImportOrder;

namespace NongSan.Application.Interfaces;

public interface IImportOrderService
{
    Task<Result<ImportOrderResponse>> CreateAsync(int shopId, CreateImportOrderRequest request);
    Task<Result<ImportOrderResponse>> GetByIdAsync(int importOrderId, int shopId);
    Task<Result<List<ImportOrderResponse>>> GetByShopAsync(int shopId);
    Task<Result<ImportOrderResponse>> ConfirmAsync(int importOrderId, int shopId);
}
