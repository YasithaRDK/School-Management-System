using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [EnableCors("AllowAllOrigins")]
    [ApiController]
    [Route("api/teacher-subject")]
    public class TeacherSubjectController : ControllerBase
    {
        private readonly ITeacherSubjectRepository _teacherSubjectRepo;

        private readonly ITeacherRepository _teacherRepo;
        private readonly ISubjectRepository _subjectRepo;
        public TeacherSubjectController(ITeacherSubjectRepository teacherSubjectRepo, ITeacherRepository teacherRepo, ISubjectRepository subjectRepo)
        {
            _teacherSubjectRepo = teacherSubjectRepo;
            _teacherRepo = teacherRepo;
            _subjectRepo = subjectRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAllocateSubjects()
        {
            var teacherSubjects = await _teacherSubjectRepo.GetAllAllocateSubjectsAsync();

            var response = teacherSubjects.Select(ts => new
            {
                TeacherId = ts.Teacher.TeacherId,
                TeacherName = ts.Teacher.FirstName + " " + ts.Teacher.LastName,
                SubjectId = ts.Subject.SubjectId,
                SubjectName = ts.Subject.SubjectName
            });

            return Ok(response);
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateSubjectsOfTeacher([FromRoute] int teacherId)
        {
            try
            {
                var teacherSubjects = await _teacherSubjectRepo.GetAllocateSubjectsOfTeacherAsync(teacherId);

                if (!teacherSubjects.Any())
                {
                    return NotFound();
                }

                var response = new
                {
                    TeacherId = teacherSubjects.First().TeacherId,
                    TeacherName = teacherSubjects.First().Teacher.FirstName + " " + teacherSubjects.First().Teacher.LastName,
                    Subjects = teacherSubjects.Select(c => new
                    {
                        SubjectId = c.Subject.SubjectId,
                        SubjectName = c.Subject.SubjectName
                    })
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AllocateSubject([FromBody] TeacherSubjectRequestDto teacherSubject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var teacher = await _teacherRepo.TeacherExistsAsync(teacherSubject.TeacherId);

                if (!teacher)
                {
                    return BadRequest(new { message = "Teacher not found" });
                }

                var subject = await _subjectRepo.SubjectExistsAsync(teacherSubject.SubjectId);

                if (!subject)
                {
                    return BadRequest(new { message = "Subject not found" });
                }

                var existingTeacherSubject = await _teacherSubjectRepo.GetTeacherSubjectAsync(teacherSubject.TeacherId, teacherSubject.SubjectId);

                if (existingTeacherSubject != null)
                {
                    return Conflict(new { message = "This subject is already assigned to the teacher" });
                }

                TeacherSubject req = new TeacherSubject
                {
                    TeacherId = teacherSubject.TeacherId,
                    SubjectId = teacherSubject.SubjectId,
                };

                await _teacherSubjectRepo.AddTeacherSubjectAsync(req);

                return StatusCode(201, new { message = "The subject assigned to the teacher" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server error" });
            }
        }

        [HttpDelete("{teacherId:int}/{subjectId:int}")]
        public async Task<IActionResult> DeleteAllocateSubject([FromRoute] int teacherId, [FromRoute] int subjectId)
        {
            try
            {
                var teacherSubject = await _teacherSubjectRepo.GetTeacherSubjectAsync(teacherId, subjectId);

                if (teacherSubject == null)
                {
                    return NotFound();
                }

                await _teacherSubjectRepo.DeleteTeacherSubjectAsync(teacherSubject);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server error" });
            }
        }
    }
}