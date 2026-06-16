using System.Net.Mail;
using System.Net;

namespace EcoWatchSystem.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string to, string subject, string bodyHtml);
    }
    public class EmailSenderService : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly int _maxRetries = 3;

        public EmailSenderService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string bodyHtml)
        {
            var provider = _config["EmailSettings:Provider"]?.ToLower();

            await SendUsingSmtpAsync(to, subject, bodyHtml);
        }

      
        private async Task SendUsingSmtpAsync(string to, string subject, string bodyHtml)
        {
            var smtpSection = _config.GetSection("EmailSettings:Smtp");
            var client = new SmtpClient(smtpSection["Host"])
            {
                Port = int.Parse(smtpSection["Port"]),
                Credentials = new NetworkCredential(smtpSection["Username"], smtpSection["Password"]),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(smtpSection["FromAddress"], "EcoWatch System"),
                Subject = subject,
                Body = bodyHtml,
                IsBodyHtml = true
            };
            message.To.Add(to);

            int retries = 0;
            while (true)
            {
                try
                {
                    await client.SendMailAsync(message);
                    break;
                }
                catch (Exception ex)
                {
                    retries++;
                    if (retries >= _maxRetries)
                        throw new Exception($"SMTP email failed after {_maxRetries} retries", ex);
                    await Task.Delay(2000); 
                }
            }
        }
    }
}
