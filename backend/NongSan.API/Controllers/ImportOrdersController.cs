using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;
using NongSan.Application.DTOs.ImportOrder;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Seller")]
public class ImportOrdersController : ControllerBase
{
    private readonly IImportOrderService _importOrderService;

    public ImportOrdersController(IImportOrderService importOrderService)
    {
        _importOrderService = importOrderService;
    }

    /// <summary>
    /// Tạo phiếu nhập hàng mới
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CreateImportOrderRequest request)
    {
        var shopId = GetShopId();
        var result = await _importOrderService.CreateAsync(shopId, request);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ImportOrderResponse>.Fail(result.ErrorMessage!));

        return Created("", ApiResponse<ImportOrderResponse>.Ok(result.Data!, "Tạo phiếu nhập thành công"));
    }

    /// <summary>
    /// Xem chi tiết phiếu nhập
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var shopId = GetShopId();
        var result = await _importOrderService.GetByIdAsync(id, shopId);

        if (!result.IsSuccess)
            return NotFound(ApiResponse<ImportOrderResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ImportOrderResponse>.Ok(result.Data!));
    }

    /// <summary>
    /// Danh sách phiếu nhập của shop
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetByShop()
    {
        var shopId = GetShopId();
        var result = await _importOrderService.GetByShopAsync(shopId);

        return Ok(ApiResponse<List<ImportOrderResponse>>.Ok(result.Data!));
    }

    /// <summary>
    /// Xác nhận phiếu nhập → cộng tồn kho
    /// </summary>
    [HttpPatch("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id)
    {
        var shopId = GetShopId();
        var result = await _importOrderService.ConfirmAsync(id, shopId);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<ImportOrderResponse>.Fail(result.ErrorMessage!));

        return Ok(ApiResponse<ImportOrderResponse>.Ok(result.Data!, "Xác nhận phiếu nhập thành công"));
    }

    private int GetShopId()
        => int.Parse(User.FindFirst("ShopId")?.Value
            ?? throw new UnauthorizedAccessException("Bạn chưa có shop."));
}
