using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Server.Core.Domain;
using Server.Core.Repositories;

namespace Server.Infrastructure.Repositories
{
    public class UserGroupRepository : Repository<UserGroup>, IUserGroupRepository 
    {
        public UserGroupRepository(GeoLocatorContext context) : base(context)
        {
        }

        public List<Group> GetAssociatedGroups(int userId)
        {
            List<UserGroup> userGroups = GeoLocatorContext.UserGroups
                .Include(ug => ug.Group)
                .Where(ug => ug.UserId == userId)
                .ToList();

            List<Group> groups = new List<Group>();
            foreach (UserGroup userGroup in userGroups)
            {
                groups.Add(userGroup.Group);
            }

            return groups;
        }

        public bool checkGroup(int userId, int groupId)
        {
            List<UserGroup> userGroups = GeoLocatorContext.UserGroups
                .Where(ug => ug.UserId == userId)
                .Where(ug => ug.GroupId == groupId).ToList();

            if (userGroups.Count != 0)
            {
                return true;
            }

            return false;
        }

        public GeoLocatorContext GeoLocatorContext
        {
            get { return Context as GeoLocatorContext; }
        }
    }
}
