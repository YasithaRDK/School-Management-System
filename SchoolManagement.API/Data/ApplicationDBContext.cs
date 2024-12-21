using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options)
        : base(options)
        {

        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TeacherClassroom> TeacherClassrooms { get; set; }
        public DbSet<TeacherSubject> TeacherSubjects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>()
               .HasOne(s => s.Classroom)
               .WithMany(c => c.Students)
               .HasForeignKey(s => s.ClassroomId)
               .OnDelete(DeleteBehavior.Restrict);

            //teacher classroom relation

            modelBuilder.Entity<TeacherClassroom>()
                .HasKey(tc => new { tc.TeacherId, tc.ClassroomId });

            modelBuilder.Entity<TeacherClassroom>()
                .HasOne(tc => tc.Teacher)
                .WithMany(t => t.TeacherClassrooms)
                .HasForeignKey(tc => tc.TeacherId);

            modelBuilder.Entity<TeacherClassroom>()
                .HasOne(tc => tc.Classroom)
                .WithMany(c => c.TeacherClassrooms)
                .HasForeignKey(tc => tc.ClassroomId);

            //teacher student relation

            modelBuilder.Entity<TeacherSubject>()
                .HasKey(ts => new { ts.TeacherId, ts.SubjectId });

            modelBuilder.Entity<TeacherSubject>()
                .HasOne(tc => tc.Teacher)
                .WithMany(t => t.TeacherSubjects)
                .HasForeignKey(tc => tc.TeacherId);

            modelBuilder.Entity<TeacherSubject>()
                .HasOne(tc => tc.Subject)
                .WithMany(c => c.TeacherSubjects)
                .HasForeignKey(tc => tc.SubjectId);
        }
    }
}