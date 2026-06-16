using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EcoWatchSystem.Configurations
{
    public class ReportAttachmentsConfiguration : IEntityTypeConfiguration<ReportAttachments>
    {
        public void Configure(EntityTypeBuilder<ReportAttachments> builder)
        {
            builder.ToTable("ReportAttachments");
            builder.HasKey(a => a.Id);

            builder.Property(a => a.FilePath).IsRequired().HasMaxLength(1000);
            builder.Property(a => a.FileName).HasMaxLength(250);

            builder.HasIndex(a => a.ReportId);
        }
    }
}
