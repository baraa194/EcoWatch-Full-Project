using EcoWatchSystem.Data;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Repositories
{
    public class RecyclingCompanyRepo : IRecyclingCompanyRepo
    {
        private readonly AppDbContext _context;
        public RecyclingCompanyRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddCompany(RecyclingCompany company)
        {
           _context.RecyclingCompanies.Add(company);
           await _context.SaveChangesAsync();
        }

        public async Task DeleteCompany(int id)
        {
            var company = await _context.RecyclingCompanies.FindAsync(id);
            _context.RecyclingCompanies.Remove(company);
            await _context.SaveChangesAsync();

        }

        public async Task<List<RecyclingCompany>> GetAllCompanies()
        {
            return await _context.RecyclingCompanies.Include(c => c.Materials).ToListAsync();
        }

        public async Task<RecyclingCompany> GetCompanyById(int companyId)
        {
           return await _context.RecyclingCompanies.Include(c => c.Materials)
                .FirstOrDefaultAsync(c => c.Id == companyId);
        }

        public async Task<RecyclingCompany> GetCompanyByNameAsync(string companyname)
        {
            return await _context.RecyclingCompanies.FirstOrDefaultAsync(c => c.Name == companyname);
        }

        public async Task UpdateCompany(RecyclingCompany company)
        {
            _context.RecyclingCompanies.Update(company);

            await _context.SaveChangesAsync();
        }
    }
}
