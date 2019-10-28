using System;
using Microsoft.EntityFrameworkCore;
using Server.Core.Domain;

namespace Server.Infrastructure
{
    public class GeoLocatorContext : DbContext
    {
        public GeoLocatorContext(DbContextOptions<GeoLocatorContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserGroup>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });
        }

    }
}
