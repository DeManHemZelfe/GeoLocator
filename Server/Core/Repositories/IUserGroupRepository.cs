using System;
using System.Collections.Generic;
using Server.Core.Domain;

namespace Server.Core.Repositories
{
    public interface IUserGroupRepository : IRepository<UserGroup>
    {
        List<Group> GetAssociatedGroups(int userId);
        bool checkGroup(int userId, int groupId);
    }
}
