using NongSan.Domain.Entities;

namespace NongSan.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    DateTime GetExpiryDate();
}
