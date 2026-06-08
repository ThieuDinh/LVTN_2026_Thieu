using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;

    public User User { get; set; } = null!;
}
