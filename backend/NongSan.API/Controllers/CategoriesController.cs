using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NongSan.API.Common;
using NongSan.Application.Interfaces;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IAppDbContext _context;

    public CategoriesController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.Icon,
                c.ParentId
            })
            .ToListAsync();

        return Ok(ApiResponse<object>.Ok(categories));
    }
}
