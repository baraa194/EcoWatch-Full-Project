using EcoWatchSystem.DTO;
using FluentValidation;

namespace EcoWatchSystem.Validators
{
    
    public class EmailQueueValidator : AbstractValidator<EmailQueueDto>
    {
        public EmailQueueValidator()
        {
       

            RuleFor(x => x.Recipient)
                .NotEmpty().WithMessage("Recipient email is required.")
                .EmailAddress().WithMessage("Invalid email address format.");

            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage("Email subject is required.")
                .MaximumLength(200);

            RuleFor(x => x.Body)
                .NotEmpty().WithMessage("Email body cannot be empty.");
        }
    }
}
