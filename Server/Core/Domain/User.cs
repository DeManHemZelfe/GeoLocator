using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Core.Domain
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [StringLength(30)]
        public string Firstname { get; set; }

        [StringLength(50)]
        public string Middlename { get; set; }

        [StringLength(10)]
        public string Infix { get; set; }

        [Required]
        [StringLength(50)]
        public string Lastname { get; set; }
    }
}
