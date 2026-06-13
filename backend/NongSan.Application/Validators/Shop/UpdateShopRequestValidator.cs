using FluentValidation;
using NongSan.Application.DTOs.Shop;

namespace NongSan.Application.Validators.Shop;

public class UpdateShopRequestValidator : AbstractValidator<UpdateShopRequest>
{
    public UpdateShopRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên shop không được để trống")
            .MaximumLength(200).WithMessage("Tên shop tối đa 200 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Mô tả tối đa 2000 ký tự")
            .When(x => x.Description != null);

        RuleFor(x => x.Province)
            .MaximumLength(100).WithMessage("Tỉnh/Thành phố tối đa 100 ký tự")
            .When(x => x.Province != null);
    }
}
