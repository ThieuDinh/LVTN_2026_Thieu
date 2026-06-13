using FluentValidation;
using NongSan.Application.DTOs.Product;

namespace NongSan.Application.Validators.Product;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
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

        RuleFor(x => x.Variants)
            .NotEmpty().WithMessage("Phải có ít nhất 1 biến thể");

        RuleForEach(x => x.Variants).SetValidator(new CreateVariantRequestValidator());
        RuleForEach(x => x.Attributes).SetValidator(new CreateAttributeRequestValidator());
    }
}

public class CreateVariantRequestValidator : AbstractValidator<CreateVariantRequest>
{
    public CreateVariantRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên biến thể không được để trống")
            .MaximumLength(100).WithMessage("Tên biến thể tối đa 100 ký tự");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Giá biến thể phải lớn hơn 0");

        RuleFor(x => x.SKU)
            .NotEmpty().WithMessage("SKU không được để trống")
            .MaximumLength(50).WithMessage("SKU tối đa 50 ký tự");
    }
}

public class CreateAttributeRequestValidator : AbstractValidator<CreateAttributeRequest>
{
    public CreateAttributeRequestValidator()
    {
        RuleFor(x => x.AttrName)
            .NotEmpty().WithMessage("Tên thuộc tính không được để trống")
            .MaximumLength(100).WithMessage("Tên thuộc tính tối đa 100 ký tự");

        RuleFor(x => x.AttrValue)
            .NotEmpty().WithMessage("Giá trị thuộc tính không được để trống")
            .MaximumLength(500).WithMessage("Giá trị thuộc tính tối đa 500 ký tự");
    }
}
