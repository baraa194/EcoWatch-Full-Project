using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class EmailAuditConfiguration : IEntityTypeConfiguration<EmailAudit>
    {
        public void Configure(EntityTypeBuilder<EmailAudit> builder)
        {
            builder.ToTable("EmailAudit");
            builder.HasKey(a => a.Id);

            // enum -> string conversion
            builder.Property(a => a.Status)
                   .HasConversion<string>()
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(a => a.SentAt).IsRequired();
            builder.Property(a => a.Message).HasMaxLength(2000);

            builder.HasOne(a => a.EmailQueue)
                   .WithMany()
                   .HasForeignKey(a => a.EmailQueueId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
