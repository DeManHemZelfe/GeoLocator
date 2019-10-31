using System;
using Server.Core.Domain;
using Server.Core.Repositories;

namespace Server.Infrastructure.Repositories
{
    public class GroupRepository : Repository<Group>, IGroupRepository
    {
        public GroupRepository(GeoLocatorContext context) : base(context)
        {
        }

        public GeoLocatorContext GeoLocatorContext
        {
            get { return Context as GeoLocatorContext; }
        }
    }
}
