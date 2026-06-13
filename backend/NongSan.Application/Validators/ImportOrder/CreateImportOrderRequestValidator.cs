using FluentValidation;
using NongSan.Application.DTOs.ImportOrder;

namespace NongSan.Application.Validators.ImportOrder;

public class CreateImportOrderRequestValidator : AbstractValidator<CreateImportOrderRequest>
{
    public CreateImportOrderRequestValidator()
    {
        RuleFor(x => x.ImportCode)
            .NotEmpty().WithMessage("Mã phiếu nhập không được để trống")
            .MaximumLength(50).WithMessage("Mã phiếu nhập tối đa 50 ký tự");

        RuleFor(x => x.SupplierName)
            .MaximumLength(200).WithMessage("Tên nhà cung cấp tối đa 200 ký tự")
            .When(x => x.SupplierName != null);

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Phải có ít nhất 1 mục nhập hàng");

        RuleForEach(x => x.Items).SetValidator(new CreateImportOrderItemRequestValidator());
    }
}

public class CreateImportOrderItemRequestValidator : AbstractValidator<CreateImportOrderItemRequest>
{
    public CreateImportOrderItemRequestValidator()
    {
        RuleFor(x => x.VariantId)
            .GreaterThan(0).WithMessage("Phải chọn biến thể sản phẩm");

        RuleFor(x => x.BatchCode)
            .NotEmpty().WithMessage("Mã lô hàng không được để trống")
            .MaximumLength(50).WithMessage("Mã lô hàng tối đa 50 ký tự");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0");

        RuleFor(x => x.CostPrice)
            .GreaterThan(0).WithMessage("Giá nhập phải lớn hơn 0");

        RuleFor(x => x.ManufacturedAt)
            .LessThan(x => x.ExpiredAt).WithMessage("Ngày sản xuất phải trước ngày hết hạn");

        RuleFor(x => x.ExpiredAt)
            .GreaterThan(DateTime.UtcNow).WithMessage("Ngày hết hạn phải sau ngày hiện tại");
    }
}
