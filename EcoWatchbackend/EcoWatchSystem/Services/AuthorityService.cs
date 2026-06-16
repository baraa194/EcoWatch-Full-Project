using AutoMapper;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;

namespace EcoWatchSystem.Services
{
  
    public interface IAuthorityService
    {
        Task<AuthorityDto> CreateAsync(AuthorityDto dto);
        Task<IEnumerable<AuthorityDto>> GetAllAsync();
        Task<AuthorityDto?> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);                   
        Task<bool> ToggleActiveAsync(int id, bool active);
    }

    public class AuthorityService : IAuthorityService
    {
        private readonly IAuthorityRepository _repo;
        private readonly IMapper _mapper;

        public AuthorityService(IAuthorityRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

     
        public async Task<AuthorityDto> CreateAsync(AuthorityDto dto)
        {
            var entity = _mapper.Map<Authorities>(dto);
            var created = await _repo.AddAsync(entity);
            return _mapper.Map<AuthorityDto>(created);
        }

     
        public async Task<IEnumerable<AuthorityDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(a => _mapper.Map<AuthorityDto>(a));
        }

       
        public async Task<AuthorityDto?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<AuthorityDto>(entity);
        }
        public async Task<bool> DeleteAsync(int id)
           => await _repo.DeleteAsync(id);

        public async Task<bool> ToggleActiveAsync(int id, bool active)
            => await _repo.ToggleActiveAsync(id, active);
    }
}
