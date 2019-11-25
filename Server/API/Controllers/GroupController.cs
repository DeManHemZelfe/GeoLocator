using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Server.Core;
using Server.Core.Domain;

namespace Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public GroupController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // api/group
        [HttpGet]
        public IEnumerable<Group> GetAllGroups()
        {
            return _unitOfWork.Groups.GetAll();
        }

        // api/group/{id}
        [HttpGet("{id}")]
        public ActionResult<Group> GetGroup(int id)
        {
            Group group = _unitOfWork.Groups.Get(id);
            if (group != null)
            {
                return group;
            }

            return NotFound();
        }

        // api/group
        [HttpPost]
        public ActionResult<Group> AddGroup([FromForm] Group group)
        {
            if (ModelState.IsValid)
            {
                Group newGroup = new Group
                {
                    Name = group.Name
                };

                _unitOfWork.Groups.Add(newGroup);
                _unitOfWork.Complete();

                return newGroup;
            }

            return BadRequest();
        }
    }
}
