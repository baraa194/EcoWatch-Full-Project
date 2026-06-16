using EcoWatchSystem.DTO;
using FluentValidation;

namespace EcoWatchSystem.Validators
{
    public class RuleValidator : AbstractValidator<RuleDto>
    {
        public RuleValidator()
        {
            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(100);

            RuleFor(x => x.Region)
                .NotEmpty().WithMessage("Region is required");

          

            RuleFor(x => x.Priority)
                .GreaterThan(0).WithMessage("Priority must be greater than 0");
        }
    }
}
