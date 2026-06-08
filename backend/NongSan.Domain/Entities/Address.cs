using NongSan.Domain.Common;

namespace NongSan.Domain.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }
    public string ReceiverName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;

    public User User { get; set; } = null!;
}

