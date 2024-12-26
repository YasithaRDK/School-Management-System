using SchoolManagement.API.Models;

namespace SchoolManagement.API.Interfaces
{
    public interface ITeacherRepository
    {
        Task<List<Teacher>> GetAllTeachersAsync();
        Task<Teacher?> GetTeacherByIdAsync(int id);
        Task AddTeacherAsync(Teacher teacher);
        Task UpdateTeacherAsync(Teacher teacher);
        Task DeleteTeacherAsync(Teacher teacher);
        Task<bool> TeacherExistsAsync(int id);
    }
}