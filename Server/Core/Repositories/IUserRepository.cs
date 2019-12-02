using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using Server.Core.Domain;


namespace Server.Core.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
            SecurityToken Authenticate(string email, string password, int group);
    };
}
