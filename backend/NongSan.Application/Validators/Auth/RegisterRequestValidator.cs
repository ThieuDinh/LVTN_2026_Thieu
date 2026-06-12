using FluentValidation;
using NongSan.Application.DTOs.Auth;

namespace NongSan.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ tên không được để trống")
            .MaximumLength(150).WithMessage("Họ tên tối đa 150 ký tự");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống")
            .EmailAddress().WithMessage("Email không đúng định dạng")
            .MaximumLength(256).WithMessage("Email tối đa 256 ký tự");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống")
            .MinimumLength(6).WithMessage("Mật khẩu tối thiểu 6 ký tự")
            .MaximumLength(100).WithMessage("Mật khẩu tối đa 100 ký tự");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Số điện thoại tối đa 20 ký tự")
            .When(x => x.Phone != null);
    }
}
