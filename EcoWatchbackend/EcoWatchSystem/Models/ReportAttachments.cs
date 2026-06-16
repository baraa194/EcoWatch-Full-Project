using EcoWatchSystem.Enums;
namespace EcoWatchSystem.Models
{
    public class ReportAttachments
    {
        public int Id { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public int ReportId { get; set; }

        public Reports Report { get; set; } = null!;
    }

}
