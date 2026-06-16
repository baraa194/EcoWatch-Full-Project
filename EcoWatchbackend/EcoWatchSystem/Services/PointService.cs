using Azure.Core;
using EcoWatchSystem.Data;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Services
{
    public class PointsService : IPointsService
    {
        private readonly AppDbContext _context;

        public PointsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AwardPointsForReportAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null || report.Status != ReportStatus.Resolved)
                return;

            bool alreadyAwarded = await _context.UserPoints
                .AnyAsync(p => p.SourceType == "Report" && p.SourceId == reportId);
            if (alreadyAwarded) return;

            int points = 20; 

            var user = await _context.Users.FindAsync(report.UserId);
            if (user == null) return;

            user.TotalPoints += points;

            _context.UserPoints.Add(new UserPoint
            {
                UserId = report.UserId,
                Points = points,
                SourceType = "Report",
                SourceId = report.Id,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
        // Add points for ImageClassification&matching(option2)
        public async Task<int> AwardPointsForRecyclingUploadsForAIAsync(List<int> transactionIds)
        {
            int totaltransactionspoints = 0;
            foreach (var transactionId in transactionIds)
            {
                var transaction = await _context.RecyclingTransactions
                    .Include(t => t.User)
                    .Include(t => t.Items)
                        .ThenInclude(i => i.Material)
                    .FirstOrDefaultAsync(t => t.Id == transactionId);
                if (transaction.Status != RecyclingStatus.Approved)
                    return 0;

                if (transaction == null) continue;
                if (transaction.User == null) continue;

                int totalPoints = (int)transaction.Items.Sum(i => i.WeightKG * i.Material.PointsPerKg);
                
                transaction.User.TotalPoints += totalPoints;
                totaltransactionspoints += totalPoints;

                _context.UserPoints.Add(new UserPoint
                {
                    UserId = transaction.User.Id,
                    Points = totalPoints,
                    SourceType = "Recycling",
                    SourceId = transactionId,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return totaltransactionspoints;
        }

        // Add points for uploadMaterials(option1)
        public async Task AwardPointsForRecyclingUploadsAsync(int transactionId)
        {
            var transaction = await _context.RecyclingTransactions
                .Include(t => t.User)
                .Include(t => t.Items)           
                    .ThenInclude(i => i.Material) 
                .FirstOrDefaultAsync(t => t.Id == transactionId);
            if (transaction.Status != RecyclingStatus.Approved)
                return;

            if (transaction == null)
                throw new Exception("Transaction not found");

            if (transaction.User == null)
                throw new Exception("User not found");

          
            int totalPoints = (int)transaction.Items.Sum(i => i.WeightKG * i.Material.PointsPerKg);

           
            transaction.User.TotalPoints += totalPoints;

            
            _context.UserPoints.Add(new UserPoint
            {
                UserId = transaction.User.Id,
                Points = totalPoints,
                SourceType = "Recycling",
                SourceId = transactionId,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            Console.WriteLine($"Points added Successfully: {totalPoints} points");
        }






        public async Task<int> GetUserPointsAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.TotalPoints ?? 0;
        }

        public async Task<bool> UpdateReportStatusAsync(int reportId, string statusString)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return false;

            ReportStatus newStatus;
            switch (statusString.Trim().ToLower())
            {
                case "pending":
                    newStatus = ReportStatus.Pending;
                    break;
                case "inprogress":
                case "in_progress":
                    newStatus = ReportStatus.InProgress;
                    break;
                case "resolved":
                    newStatus = ReportStatus.Resolved;
                    break;
                case "rejected":
                    newStatus = ReportStatus.Rejected;
                    break;
                default:
                    return false;
            }

            report.Status = newStatus;
            await _context.SaveChangesAsync();

            if (newStatus == ReportStatus.Resolved)
                await AwardPointsForReportAsync(reportId);

            return true;
        }


    }
}
