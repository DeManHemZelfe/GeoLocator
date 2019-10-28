using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Server.Core.Domain;
using Server.Core.Repositories;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Server.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(GeoLocatorContext context) : base(context)
        {
        }

        public GeoLocatorContext GeoLocatorContext
        {
            get { return Context as GeoLocatorContext; }
        }
    }
}
