using SchoolManagement.API.Models;

namespace SchoolManagement.API.Interfaces
{
    public interface ISubjectRepository
    {
        Task<List<Subject>> GetAllSubjectsAsync();
        Task<Subject?> GetSubjectByIdAsync(int id);
        Task AddSubjectAsync(Subject subject);
        Task UpdateSubjectAsync(Subject subject);
        Task DeleteSubjectAsync(Subject subject);
        Task<bool> SubjectExistsAsync(int id);
    }
}