using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class RoutingHistoryConfiguration : IEntityTypeConfiguration<RoutingHistory>
    {
        public void Configure(EntityTypeBuilder<RoutingHistory> builder)
        {
            builder.ToTable("RoutingHistory");
            builder.HasKey(h => h.Id);

            builder.Property(h => h.RoutedAt).IsRequired();

            builder.HasIndex(h => new { h.ReportId, h.AuthorityId });

            builder.HasOne(h => h.Report)
                   .WithMany(r => r.RoutingHistories)
                   .HasForeignKey(h => h.ReportId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(h => h.Authority)
                   .WithMany(a => a.RoutingHistories)
                   .HasForeignKey(h => h.AuthorityId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
