namespace EcoWatchSystem.Services
{
    public interface IPointsService
    {
        Task AwardPointsForReportAsync(int reportId);
        public Task<int> AwardPointsForRecyclingUploadsForAIAsync(List<int> transactionIds);
        Task AwardPointsForRecyclingUploadsAsync(int transactionId);
        Task<int> GetUserPointsAsync(string userId);
        Task<bool> UpdateReportStatusAsync(int reportId, string statusString);

    }
}
