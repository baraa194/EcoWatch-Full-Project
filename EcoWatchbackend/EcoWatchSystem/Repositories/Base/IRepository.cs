namespace EcoWatchSystem.Repositories.Base
{
    public interface IRepository<T> where T : class
    {
        public void Add(T entity);
        public void Update(T entity);
        public T GetById(int id);
        public IEnumerable<T> GetAll();
        public void Delete(int id);
        public void Save();
    }
}
