using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
using SchoolManagement.API.Data.Dtos.ResponseDtos;
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
            .GroupBy(tc => new
            {
                tc.Teacher.TeacherId,
                TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName
            })
            .Select(g => new
            {
                TeacherId = g.Key.TeacherId,
                TeacherName = g.Key.TeacherName,
                Subjects = g.Select(ts => new
                {
                    SubjectId = ts.Subject.SubjectId,
                    SubjectName = ts.Subject.SubjectName
                }).ToList()
            })
            .ToListAsync();

            return Ok(teacherSubjects);
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateSubjectsOfTeacher([FromRoute] int teacherId)
        {
            var teacherSubjects = await _context.TeacherSubjects
                .Where(tc => tc.TeacherId == teacherId)
                .GroupBy(tc => new
                {
                    tc.Teacher.TeacherId,
                    TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName
                })
                .Select(g => new
                {
                    TeacherId = g.Key.TeacherId,
                    TeacherName = g.Key.TeacherName,
                    Subjects = g.Select(ts => new
                    {
                        SubjectId = ts.Subject.SubjectId,
                        SubjectName = ts.Subject.SubjectName
                    }).ToList()
                })
                .ToListAsync();

            if (teacherSubjects == null)
            {
                return NotFound();
            }

            return Ok(teacherSubjects);
        }

        [HttpPost]
        public async Task<IActionResult> AllocateSubject([FromBody] TeacherSubjectRequestDto teacherSubject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

            TeacherSubject req = new TeacherSubject
            {
                TeacherId = teacherSubject.TeacherId,
                SubjectId = teacherSubject.SubjectId,
            };

            await _context.TeacherSubjects.AddAsync(req);

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "The subject assigned to the teacher" });
        }

        [HttpDelete("{teacherId:int}/{subjectId:int}")]
        public async Task<IActionResult> DeleteAllocateSubject([FromRoute] int teacherId, [FromRoute] int subjectId)
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
    }
}