using EcoWatchSystem.DTO;
using FluentValidation;

namespace EcoWatchSystem.Validators
{
    
    public class AuthorityValidator : AbstractValidator<AuthorityDto>
    {
        public AuthorityValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required").MaximumLength(150);
            RuleFor(x => x.ContactEmail).NotEmpty().WithMessage("ContactEmail is required").EmailAddress();
            RuleFor(x => x.Region).NotEmpty().WithMessage("Region is required");
        }
    }
}
