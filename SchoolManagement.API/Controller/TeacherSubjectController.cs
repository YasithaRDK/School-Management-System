using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("api/teacher-subject")]
    public class TeacherSubjectController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public TeacherSubjectController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAllocateSubjects()
        {
            var teacherSubjects = await _context.TeacherSubjects
            .Include(tc => tc.Teacher)
            .Include(tc => tc.Subject)
            .ToListAsync();

            var response = teacherSubjects.Select(teacherSubject => new
            {
                TeacherId = teacherSubject.Teacher.TeacherId,
                TeacherName = teacherSubject.Teacher.FirstName + " " + teacherSubject.Teacher.LastName,
                SubjectId = teacherSubject.Subject.SubjectId,
                SubjectName = teacherSubject.Subject.SubjectName
            });

            return Ok(response);
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateSubjectsOfTeacher([FromRoute] int teacherId)
        {
            try
            {
                var teacherSubjects = await _context.TeacherSubjects
                .Where(tc => tc.TeacherId == teacherId)
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Subject)
                .Select(tc => new
                {
                    TeacherId = tc.Teacher.TeacherId,
                    TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName,
                    SubjectId = tc.Subject.SubjectId,
                    SubjectName = tc.Subject.SubjectName
                })
                .ToListAsync();

                if (!teacherSubjects.Any())
                {
                    return NotFound();
                }

                var response = new
                {
                    TeacherId = teacherSubjects.First().TeacherId,
                    TeacherName = teacherSubjects.First().TeacherName,
                    Subjects = teacherSubjects.Select(c => new
                    {
                        SubjectId = c.SubjectId,
                        SubjectName = c.SubjectName
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
                var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.TeacherId == teacherSubject.TeacherId);

                if (teacher == null)
                {
                    return BadRequest(new { message = "Teacher not found" });
                }

                var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.SubjectId == teacherSubject.SubjectId);

                if (subject == null)
                {
                    return BadRequest(new { message = "Subject not found" });
                }

                var existingTeacherSubject = await _context.TeacherSubjects
                .FirstOrDefaultAsync(tc => tc.TeacherId == teacherSubject.TeacherId && tc.SubjectId == teacherSubject.SubjectId);

                if (existingTeacherSubject != null)
                {
                    return Conflict(new { message = "This subject is already assigned to the teacher" });
                }

                TeacherSubject req = new TeacherSubject
                {
                    TeacherId = teacherSubject.TeacherId,
                    SubjectId = teacherSubject.SubjectId,
                };

                await _context.TeacherSubjects.AddAsync(req);

                await _context.SaveChangesAsync();

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
                var teacherSubject = await _context.TeacherSubjects.FirstOrDefaultAsync(ts => ts.TeacherId == teacherId && ts.SubjectId == subjectId);

                if (teacherSubject == null)
                {
                    return NotFound();
                }

                _context.TeacherSubjects.Remove(teacherSubject);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server error" });
            }
        }
    }
}