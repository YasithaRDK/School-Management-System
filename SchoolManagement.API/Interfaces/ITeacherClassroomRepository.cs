using SchoolManagement.API.Models;

namespace SchoolManagement.API.Interfaces
{
    public interface ITeacherClassroomRepository
    {
        Task<List<TeacherClassroom>> GetAllAllocateClassroomsAsync();
        Task<List<TeacherClassroom>> GetAllocateClassroomsOfTeacherAsync(int teacherId);
        Task<TeacherClassroom?> GetTeacherClassroomAsync(int teacherId, int classroomId);
        Task AddTeacherClassroomAsync(TeacherClassroom teacherClassroom);
        Task DeleteTeacherClassroomAsync(TeacherClassroom teacherClassroom);
    }
}