using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.Common;
using NongSan.Application.DTOs.Product;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Seller")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    /// Tạo sản phẩm mới (kèm variants + attributes)
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        var shopId = GetShopId();
        var result = await _productService.CreateAsync(shopId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ProductResponse>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<ProductResponse>.Ok(result.Data!, "Tạo sản phẩm thành công"));
    }

    /// <summary>
    /// Cập nhật thông tin sản phẩm
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProductRequest request)
    {
        var shopId = GetShopId();
        var result = await _productService.UpdateAsync(id, shopId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ProductResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ProductResponse>.Ok(result.Data!, "Cập nhật sản phẩm thành công"));
    }

    /// <summary>
    /// Lấy danh sách tất cả sản phẩm Active (public)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] ProductSearchRequest request)
    {
        var result = await _productService.SearchAsync(request);

        return Ok(ApiResponse<PagedResult<ProductResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Tìm kiếm / duyệt sản phẩm (public)
    /// </summary>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search([FromQuery] ProductSearchRequest request)
    {
        var result = await _productService.SearchAsync(request);

        return Ok(ApiResponse<PagedResult<ProductResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Xem chi tiết sản phẩm
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _productService.GetByIdAsync(id);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ProductResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ProductResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Lấy danh sách sản phẩm của shop mình
    /// </summary>
    [HttpGet("my-products")]
    public async Task<IActionResult> GetMyProducts()
    {
        var shopId = GetShopId();
        var result = await _productService.GetByShopAsync(shopId);

        return Ok(ApiResponse<List<ProductResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Xóa sản phẩm (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var shopId = GetShopId();
        var result = await _productService.DeleteAsync(id, shopId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<bool>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<bool>.Ok(true, "Xóa sản phẩm thành công"));
    }

    /// <summary>
    /// Bật / tắt trạng thái sản phẩm (Active ↔ Draft)
    /// </summary>
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var shopId = GetShopId();
        var result = await _productService.ToggleStatusAsync(id, shopId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ProductResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ProductResponse>.Ok(result.Data!, "Cập nhật trạng thái thành công"));
    }

    private int GetShopId()
        => int.Parse(User.FindFirst("ShopId")?.Value
            ?? throw new UnauthorizedAccessException("Bạn chưa có shop."));
}
