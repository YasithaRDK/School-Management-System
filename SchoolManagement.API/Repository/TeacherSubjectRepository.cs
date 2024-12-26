using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Repository
{
    public class TeacherSubjectRepository : ITeacherSubjectRepository
    {
        private readonly ApplicationDBContext _context;
        public TeacherSubjectRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddTeacherSubjectAsync(TeacherSubject teacherSubject)
        {
            await _context.TeacherSubjects.AddAsync(teacherSubject);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTeacherSubjectAsync(TeacherSubject teacherSubject)
        {
            _context.TeacherSubjects.Remove(teacherSubject);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TeacherSubject>> GetAllAllocateSubjectsAsync()
        {
            return await _context.TeacherSubjects
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Subject)
                .ToListAsync();
        }

        public async Task<List<TeacherSubject>> GetAllocateSubjectsOfTeacherAsync(int teacherId)
        {
            return await _context.TeacherSubjects
                .Where(tc => tc.TeacherId == teacherId)
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Subject)
                .ToListAsync();
        }

        public async Task<TeacherSubject?> GetTeacherSubjectAsync(int teacherId, int subjectId)
        {
            return await _context.TeacherSubjects
               .FirstOrDefaultAsync(tc => tc.TeacherId == teacherId && tc.SubjectId == subjectId);
        }
    }
}