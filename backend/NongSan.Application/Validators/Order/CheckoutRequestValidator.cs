using FluentValidation;
using NongSan.Application.DTOs.Order;

namespace NongSan.Application.Validators.Order;

public class CheckoutRequestValidator : AbstractValidator<CheckoutRequest>
{
    public CheckoutRequestValidator()
    {
        RuleFor(x => x.AddressId)
            .GreaterThan(0).WithMessage("Vui lòng chọn địa chỉ giao hàng");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Phải chọn phương thức thanh toán")
            .Must(x => x == "COD" || x == "BankTransfer")
            .WithMessage("Phương thức thanh toán không hợp lệ");
    }
}
