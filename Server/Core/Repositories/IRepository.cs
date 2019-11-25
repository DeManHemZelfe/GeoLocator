using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Server.Core.Repositories
{
    public interface IRepository<TEntity> where TEntity : class
    {
        TEntity Get(int id);
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> expression);

        void Add(TEntity entity);
        void AddMultiple(IEnumerable<TEntity> entities);

        void Update(TEntity entity);

        void Remove(TEntity entity);
        void RemoveMultiple(IEnumerable<TEntity> entities); 
    }
}
