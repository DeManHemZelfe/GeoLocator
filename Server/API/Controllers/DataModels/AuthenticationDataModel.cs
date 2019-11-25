using System.Collections.Generic;
using Server.Core.Domain;

namespace Server.API.Controllers.DataModels
{

    public class AuthenticationDataModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public int Group { get; set; }
    }
}