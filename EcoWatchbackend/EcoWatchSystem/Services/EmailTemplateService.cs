using EcoWatchSystem.DTO;
using System.Text;
using System.Web;
using Validation;

namespace EcoWatchSystem.Services
{
    public interface IEmailTemplateService
    {
        (string Subject, string Body) GenerateReportEmail(ReportDetailsDto report);
    }

    public class EmailTemplateService : IEmailTemplateService
    {
        public (string Subject, string Body) GenerateReportEmail(ReportDetailsDto report)
        {
         
            var subject = $"New Environmental Report: {report.Title} ({report.Category})";

       
            var sb = new StringBuilder();
            sb.Append("<html><body style='font-family:Arial; color:#222;'>");
            sb.Append("<h2 style='color:#2e8b57;'>🌍 New Environmental Report Received</h2>");
            sb.Append("<table border='1' cellpadding='6' cellspacing='0' style='border-collapse:collapse;'>");

            sb.Append($"<tr><td><b>Title</b></td><td>{HttpUtility.HtmlEncode(report.Title)}</td></tr>");
            sb.Append($"<tr><td><b>Category</b></td><td>{HttpUtility.HtmlEncode(report.Category)}</td></tr>");
            sb.Append($"<tr><td><b>Description</b></td><td>{HttpUtility.HtmlEncode(report.Description)}</td></tr>");
            sb.Append($"<tr><td><b>Address</b></td><td>{HttpUtility.HtmlEncode(report.Region ?? "N/A")}</td></tr>");
            sb.Append("</table>");


         
            if (report.AttachmentUrls != null && report.AttachmentUrls.Any())
            {
                sb.Append("<p><b>Attachments:</b></p><ul>");
                foreach (var link in report.AttachmentUrls)
                    sb.Append($"<li><a href='{link}'>{link}</a></li>");
                sb.Append("</ul>");
            }

            sb.Append("<hr><p style='color:#555;'>EcoWatch Automated Email Service 🌿</p>");
            sb.Append("</body></html>");

            var body = sb.ToString();

            return (subject, body);
        }
    }
}
