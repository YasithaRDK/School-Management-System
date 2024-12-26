using SchoolManagement.API.Models;

namespace SchoolManagement.API.Interfaces
{
    public interface ITeacherSubjectRepository
    {
        Task<List<TeacherSubject>> GetAllAllocateSubjectsAsync();
        Task<List<TeacherSubject>> GetAllocateSubjectsOfTeacherAsync(int teacherId);
        Task<TeacherSubject?> GetTeacherSubjectAsync(int teacherId, int subjectId);
        Task AddTeacherSubjectAsync(TeacherSubject teacherSubject);
        Task DeleteTeacherSubjectAsync(TeacherSubject teacherSubject);
    }
}