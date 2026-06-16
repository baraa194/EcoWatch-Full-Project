using EcoWatchSystem.Models;
using EcoWatchSystem.Data;
using EcoWatchSystem.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcoWatchSystem.Repositories
{
    public class AuthorityRepository:IAuthorityRepository
    {
        private readonly AppDbContext _db;
        public AuthorityRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Authorities>> GetAllAsync()
            => await _db.Authorities.AsNoTracking().ToListAsync();

        public async Task<Authorities?> GetByIdAsync(int id)
            => await _db.Authorities.FindAsync(id);

        public async Task<Authorities> AddAsync(Authorities authority)
        {
            _db.Authorities.Add(authority);
            await _db.SaveChangesAsync();
            return authority; 
        }


        public async Task UpdateAsync(Authorities authority)
        {
            _db.Authorities.Update(authority);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _db.Authorities.FindAsync(id);
            if (item == null) return false;

            _db.Authorities.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleActiveAsync(int id, bool isActive)
        {
            var authority = await _db.Authorities.FindAsync(id);
            if (authority == null) return false;

            authority.IsActive = isActive;
            _db.Authorities.Update(authority);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
