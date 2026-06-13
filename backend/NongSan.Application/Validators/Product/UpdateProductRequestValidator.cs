using FluentValidation;
using NongSan.Application.DTOs.Product;

namespace NongSan.Application.Validators.Product;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên sản phẩm không được để trống")
            .MaximumLength(200).WithMessage("Tên sản phẩm tối đa 200 ký tự");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Phải chọn danh mục");

        RuleFor(x => x.Unit)
            .NotEmpty().WithMessage("Đơn vị không được để trống")
            .MaximumLength(50).WithMessage("Đơn vị tối đa 50 ký tự");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage("Giá phải lớn hơn 0");
    }
}
