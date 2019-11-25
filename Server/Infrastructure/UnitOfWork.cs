using System;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Core.Domain;
using Server.Core.Repositories;
using Server.Infrastructure.Repositories;

namespace Server.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly GeoLocatorContext _context;

        public UnitOfWork(GeoLocatorContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Groups = new GroupRepository(_context);
            UserGroups = new UserGroupRepository(_context);
        }

        public IUserRepository Users { get; private set; }
        public IGroupRepository Groups { get; private set; }
        public IUserGroupRepository UserGroups { get; private set; }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
