using EcoWatchSystem.Models;

namespace EcoWatchSystem.Services
{
    public interface IFilterService
    {
        List<FilterRecyclingDetection> GetClassSummary(List<RecyclingDetection> detections);
    }

    public class FilterService : IFilterService
    {
        public List<FilterRecyclingDetection> GetClassSummary(List<RecyclingDetection> detections)
        {
            return detections
                .GroupBy(d => d.Class)
                .Select(g => new FilterRecyclingDetection
                {
                    ClassName = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(s => s.Count)
                .ToList();
        }
    }
}
