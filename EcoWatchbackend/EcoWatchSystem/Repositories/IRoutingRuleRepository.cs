using EcoWatchSystem.Models;

namespace EcoWatchSystem.Repositories
{
    public interface IRoutingRuleRepository
    {
        Task<IEnumerable<EmailRoutingRules>> GetAllAsync();
        Task<EmailRoutingRules?> GetByIdAsync(int id);
        Task<EmailRoutingRules> AddAsync(EmailRoutingRules rule);
        Task UpdateAsync(EmailRoutingRules rule);

        Task<bool> ToggleActiveAsync(int id, bool isActive);
        Task<bool> DeleteAsync(int id);

        Task<List<EmailRoutingRules>> GetMatchingRulesAsync(string category);
        Task<IEnumerable<EmailRoutingRules>> GetActiveByCategoryAsync(string category);
    }
}
