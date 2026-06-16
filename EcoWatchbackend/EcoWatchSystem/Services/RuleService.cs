using AutoMapper;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;

namespace EcoWatchSystem.Services
{
    public interface IRuleService
    {
        Task<RuleDto> CreateAsync(RuleDto ruleDto);
        Task<IEnumerable<RuleDto>> GetAllAsync();
        Task<IEnumerable<RuleDto>> GetMatchingAsync(string category);
        Task<bool> ToggleActiveAsync(int id, bool isActive);
        Task<bool> DeleteAsync(int id);
    }

    public class RuleService : IRuleService
    {
        private readonly IRoutingRuleRepository _repo;
        private readonly IMapper _mapper;
    

        public RuleService(IRoutingRuleRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
      
        }

        public async Task<RuleDto> CreateAsync(RuleDto ruleDto)
        {
            var entity = _mapper.Map<EmailRoutingRules>(ruleDto);  
            var created = await _repo.AddAsync(entity);
            return _mapper.Map<RuleDto>(created); 
        }

        public async Task<IEnumerable<RuleDto>> GetAllAsync()
        {
            var rules = await _repo.GetAllAsync();
            return rules.Select(r => _mapper.Map<RuleDto>(r));
        }

        public async Task<IEnumerable<RuleDto>> GetMatchingAsync(string category)
        {
            var matches = await _repo.GetActiveByCategoryAsync(category);
            return matches.Select(m => _mapper.Map<RuleDto>(m));
        }


        public async Task<bool> ToggleActiveAsync(int id, bool isActive)
        {
            return await _repo.ToggleActiveAsync(id, isActive);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repo.DeleteAsync(id);
        }

    }
}
