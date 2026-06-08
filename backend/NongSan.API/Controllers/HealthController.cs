using Microsoft.AspNetCore.Mvc;
using NongSan.API.Common;

namespace NongSan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(ApiResponse<object>.Ok(new { Status = "Healthy" }));
    }
}

