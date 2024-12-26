using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Repository
{
    public class TeacherClassroomRepository : ITeacherClassroomRepository
    {
        private readonly ApplicationDBContext _context;
        public TeacherClassroomRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddTeacherClassroomAsync(TeacherClassroom teacherClassroom)
        {
            await _context.TeacherClassrooms.AddAsync(teacherClassroom);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTeacherClassroomAsync(TeacherClassroom teacherClassroom)
        {
            _context.TeacherClassrooms.Remove(teacherClassroom);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TeacherClassroom>> GetAllAllocateClassroomsAsync()
        {
            return await _context.TeacherClassrooms
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Classroom)
                .ToListAsync();
        }

        public async Task<List<TeacherClassroom>> GetAllocateClassroomsOfTeacherAsync(int teacherId)
        {
            return await _context.TeacherClassrooms
                .Where(tc => tc.TeacherId == teacherId)
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Classroom)
                .ToListAsync();
        }

        public async Task<TeacherClassroom?> GetTeacherClassroomAsync(int teacherId, int classroomId)
        {
            return await _context.TeacherClassrooms
              .FirstOrDefaultAsync(tc => tc.TeacherId == teacherId && tc.ClassroomId == classroomId);
        }
    }
}