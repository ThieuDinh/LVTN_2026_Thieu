using NongSan.Application.Common;
using NongSan.Application.DTOs.Product;

namespace NongSan.Application.Interfaces;

public interface IProductService
{
    Task<Result<ProductResponse>> CreateAsync(int shopId, CreateProductRequest request);
    Task<Result<ProductResponse>> UpdateAsync(int productId, int shopId, UpdateProductRequest request);
    Task<Result<ProductResponse>> GetByIdAsync(int productId);
    Task<Result<List<ProductResponse>>> GetByShopAsync(int shopId);
    Task<Result<bool>> DeleteAsync(int productId, int shopId);
}
