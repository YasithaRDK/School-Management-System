using SchoolManagement.API.Models;

namespace SchoolManagement.API.Interfaces
{
    public interface IClassroomRepository
    {
        Task<List<Classroom>> GetAllClassroomsAsync();
        Task<Classroom?> GetClassroomByIdAsync(int id);
        Task AddClassroomAsync(Classroom classroom);
        Task UpdateClassroomAsync(Classroom classroom);
        Task DeleteClassroomAsync(Classroom classroom);
        Task<bool> ClassroomExistsAsync(int id);
    }
}