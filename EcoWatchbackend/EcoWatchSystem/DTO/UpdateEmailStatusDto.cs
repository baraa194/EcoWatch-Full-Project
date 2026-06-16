using EcoWatchSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace EcoWatchSystem.DTO
{
    public class UpdateEmailStatusDto
    {
        [Required]
        public AuditStatus Status { get; set; }

      
        public bool IncrementAttempt { get; set; } = false;
    }
}
