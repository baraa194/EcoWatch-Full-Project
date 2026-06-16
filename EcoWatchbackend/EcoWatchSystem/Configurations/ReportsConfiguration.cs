using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class ReportsConfiguration : IEntityTypeConfiguration<Reports>
    {
        public void Configure(EntityTypeBuilder<Reports> builder)
        {
            builder.ToTable("Reports");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Title).IsRequired().HasMaxLength(250);
            builder.Property(r => r.Description).HasMaxLength(4000);
            builder.Property(r => r.Category).IsRequired().HasMaxLength(100);
            builder.Property(r => r.Region).IsRequired().HasMaxLength(100);
            builder.Property(r => r.CreatedAt).IsRequired();

            // enum -> string conversion for Status
            builder.Property(r => r.Status)
                   .HasConversion<string>()
                   .HasMaxLength(50)
                   .IsRequired();

            builder.HasIndex(r => new { r.Category, r.Region });

            builder.HasMany(r => r.Attachments)
                   .WithOne(a => a.Report)
                   .HasForeignKey(a => a.ReportId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.RoutingHistories)
                   .WithOne(h => h.Report)
                   .HasForeignKey(h => h.ReportId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
