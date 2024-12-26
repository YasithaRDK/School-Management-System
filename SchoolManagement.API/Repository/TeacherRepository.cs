using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Repository
{
    public class TeacherRepository : ITeacherRepository
    {
        private readonly ApplicationDBContext _context;
        public TeacherRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddTeacherAsync(Teacher teacher)
        {
            await _context.Teachers.AddAsync(teacher);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTeacherAsync(Teacher teacher)
        {
            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Teacher>> GetAllTeachersAsync()
        {
            return await _context.Teachers.ToListAsync();

        }

        public async Task<Teacher?> GetTeacherByIdAsync(int id)
        {
            return await _context.Teachers.FirstOrDefaultAsync(i => i.TeacherId == id);
        }

        public async Task<bool> TeacherExistsAsync(int id)
        {
            return await _context.Teachers.AnyAsync(i => i.TeacherId == id);
        }

        public async Task UpdateTeacherAsync(Teacher teacher)
        {
            _context.Teachers.Update(teacher);
            await _context.SaveChangesAsync();
        }
    }
}