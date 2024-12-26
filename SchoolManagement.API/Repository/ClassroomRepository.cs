using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Repository
{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly ApplicationDBContext _context;
        public ClassroomRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddClassroomAsync(Classroom classroom)
        {
            await _context.Classrooms.AddAsync(classroom);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteClassroomAsync(Classroom classroom)
        {
            _context.Classrooms.Remove(classroom);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Classroom>> GetAllClassroomsAsync()
        {
            return await _context.Classrooms.ToListAsync();
        }

        public async Task<Classroom?> GetClassroomByIdAsync(int id)
        {
            return await _context.Classrooms.FirstOrDefaultAsync(c => c.ClassroomId == id);
        }

        public async Task UpdateClassroomAsync(Classroom classroom)
        {
            _context.Classrooms.Update(classroom);
            await _context.SaveChangesAsync();
        }
    }
}