using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Core.Domain;
using Microsoft.AspNetCore.Identity;
using Server.API.Controllers.DataModels;
using System.Linq;

namespace Server.API.Controllers
{
    // All user routes can be acces with api/user
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        // Dependency inject the UnitOfWork class
        private readonly IUnitOfWork _unitOfWork;
        private readonly PasswordHasher<User> passwordHasher = new PasswordHasher<User>();

        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // api/user
        [HttpGet]
        public IEnumerable<User> GetAllUsers()
        {
            return _unitOfWork.Users.GetAll();
        }

        // api/user/{id}
        [HttpGet("{id:int}")]
        public ActionResult<GetUserDataModel> GetUser(int id)
        {
            User user = _unitOfWork.Users.Get(id);
            if (user != null)
            {
                List<Group> groups = _unitOfWork.UserGroups.GetAssociatedGroups(id);

                GetUserDataModel dataModel = new GetUserDataModel
                {
                    Id = user.Id,
                    Email = user.Email,
                    Password = user.Password,
                    Firstname = user.Firstname,
                    Middlename = user.Middlename,
                    Infix = user.Infix,
                    Lastname = user.Lastname,
                    Groups = groups
                };

                return dataModel;
            }

            return NotFound();
        }

        // api/user
        [HttpPost]
        public ActionResult<User> AddUser([FromForm] User user)
        {
            if (ModelState.IsValid)
            {
                string hashedPassword = passwordHasher.HashPassword(user, user.Password);

                User newUser = new User
                {
                    Email = user.Email,
                    Password = hashedPassword,
                    Firstname = user.Firstname,
                    Middlename = user.Middlename,
                    Infix = user.Infix,
                    Lastname = user.Lastname
                };

                _unitOfWork.Users.Add(newUser);
                _unitOfWork.Complete();

                return newUser;
            }

            return BadRequest();
        }

        // api/user/{id}
        [HttpPut("{id:int}")]
        public ActionResult UpdateUser(int id, [FromForm] User newUser)
        {
            // TODO: Implement authorization checl
            if (id != newUser.Id)
            {
                _unitOfWork.Users.Update(newUser);
                _unitOfWork.Complete();

                return NoContent();
            }

            return BadRequest();

        }

        // api/user/{id}
        [HttpDelete("{id:int}")]
        public ActionResult<User> DeleteUser(int id)
        {
            // TODO: Implement authorization check
            User user = _unitOfWork.Users.Get(id);

            if (user != null)
            {
                _unitOfWork.Users.Remove(user);
                _unitOfWork.Complete();
                return user;
            }

            return NotFound();
        }

        // api/user/{userId}/add-group/{groupId}
        [HttpPost]
        [Route("{userId:int}/add-group/{groupId:int}")]
        public ActionResult<UserGroup> AddGroupToUser(int userId, int groupId)
        {
            User user = _unitOfWork.Users.Get(userId);
            Group group = _unitOfWork.Groups.Get(groupId);

            if (user != null && group != null)
            {
                bool userHasGroup = _unitOfWork.UserGroups.checkGroup(userId, groupId);

                if (!userHasGroup)
                {
                    UserGroup userGroup = new UserGroup
                    {
                        User = user,
                        Group = group
                    };

                    _unitOfWork.UserGroups.Add(userGroup);
                    _unitOfWork.Complete();

                    return userGroup;
                }
            }

            return BadRequest();
        }
    }
}
