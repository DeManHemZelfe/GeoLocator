using System;
using System.Collections.Generic;
using Server.Core.Domain;

namespace Server.API.Controllers.DataModels
{
    public class GetUserDataModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Middlename { get; set; }
        public string Infix { get; set; }
        public string Lastname { get; set; }
        public List<Group> Groups { get; set; }
    }
}
