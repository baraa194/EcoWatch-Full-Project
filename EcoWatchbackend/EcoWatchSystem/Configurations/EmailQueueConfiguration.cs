using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class EmailQueueConfiguration : IEntityTypeConfiguration<EmailQueue>
    {
        public void Configure(EntityTypeBuilder<EmailQueue> builder)
        {
            builder.ToTable("EmailQueue");
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Recipient).IsRequired().HasMaxLength(250);
            builder.Property(e => e.Subject).HasMaxLength(500);
            builder.Property(e => e.Body).HasMaxLength(8000);
            builder.Property(e => e.CreatedAt).IsRequired();

            builder.HasIndex(e => new { e.Sent, e.CreatedAt });
        }
    }
}
