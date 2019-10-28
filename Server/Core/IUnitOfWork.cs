using System;
using Server.Core.Domain;
using Server.Core.Repositories;

namespace Server.Core
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IGroupRepository Groups { get; }
        IUserGroupRepository UserGroups { get; }
        int Complete();
    }
}
