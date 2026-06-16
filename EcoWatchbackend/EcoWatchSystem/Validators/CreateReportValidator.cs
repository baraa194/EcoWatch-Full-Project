using EcoWatchSystem.DTO;
using FluentValidation;

namespace EcoWatchSystem.Validators
{
    
    public class CreateReportValidator : AbstractValidator<ReportRequest>
    {
        public CreateReportValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(150);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required");

        }
    }
}
