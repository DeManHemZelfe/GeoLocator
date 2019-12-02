using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Server.Core.Domain;
using Server.Core.Repositories;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;

namespace Server.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly PasswordHasher<User> passwordHasher = new PasswordHasher<User>();

        public UserRepository(GeoLocatorContext context) : base(context)
        {
        }

        public SecurityToken Authenticate(string email, string password, int group)
        {
            User user = GeoLocatorContext.Set<User>().SingleOrDefault(u => u.Email == email);

            if (user == null)
                return null; 

            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, password);

            if (passwordVerificationResult == 0)
                return null;

            var userGroup = GeoLocatorContext.Set<UserGroup>()
                .Include(ug => ug.Group)
                .Where(ug => ug.UserId == user.Id && ug.GroupId == group)
                .SingleOrDefault();

            if (userGroup == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("BA75D4CCA5DCF9DDC13F21EDEC639");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.GivenName, user.Firstname),
                    new Claim("middlename", user.Middlename),
                    new Claim("infix", user.Infix),
                    new Claim(ClaimTypes.Surname, user.Lastname),
                    new Claim("groupId", userGroup.GroupId.ToString()),
                    new Claim("groupName", userGroup.Group.Name) 
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return token;
        }

        public GeoLocatorContext GeoLocatorContext
        {
            get { return Context as GeoLocatorContext; }
        }
    }
}
