using FluentValidation;
using NongSan.Application.DTOs.Cart;

namespace NongSan.Application.Validators.Cart;

public class AddCartItemRequestValidator : AbstractValidator<AddCartItemRequest>
{
    public AddCartItemRequestValidator()
    {
        RuleFor(x => x.VariantId)
            .GreaterThan(0).WithMessage("Phải chọn biến thể sản phẩm");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0")
            .LessThanOrEqualTo(99).WithMessage("Số lượng tối đa 99");
    }
}
