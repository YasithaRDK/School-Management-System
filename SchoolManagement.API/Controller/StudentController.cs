using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/students")]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public StudentController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var students = await _context.Students
            .Include(s => s.Classroom)
            .ToListAsync();

                var response = students.Select(student => new
                {
                    StudentId = student.StudentId,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    ContactPerson = student.ContactPerson,
                    ContactNo = student.ContactNo,
                    EmailAddress = student.EmailAddress,
                    DateOfBirth = student.DateOfBirth,
                    Age = student.Age,
                    ClassroomName = student.Classroom?.ClassroomName
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetStudent(int id)
        {
            try
            {
                var student = await _context.Students
                .Include(s => s.Classroom)
                .ThenInclude(c => c.TeacherClassrooms)
                .ThenInclude(tc => tc.Teacher)
                .ThenInclude(t => t.TeacherSubjects)
                .ThenInclude(ts => ts.Subject)
                .FirstOrDefaultAsync(s => s.StudentId == id);

                if (student == null)
                {
                    return NotFound();
                }

                var response = new
                {
                    StudentId = student.StudentId,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    ContactPerson = student.ContactPerson,
                    ContactNo = student.ContactNo,
                    EmailAddress = student.EmailAddress,
                    DateOfBirth = student.DateOfBirth,
                    Age = student.Age,
                    ClassroomName = student.Classroom?.ClassroomName,
                    Teacher = student.Classroom?.TeacherClassrooms.Select(tc => new
                    {
                        TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName,
                        Subjects = tc.Teacher.TeacherSubjects.Select(ts => ts.Subject.SubjectName).ToList()
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] StudentRequestDto studentRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingClassroom = await _context.Classrooms.FirstOrDefaultAsync(c => c.ClassroomId == studentRequest.ClassroomId);

                if (existingClassroom == null)
                {
                    return BadRequest(new { message = "Classroom not found" });
                }

                Student req = new Student
                {
                    FirstName = studentRequest.FirstName,
                    LastName = studentRequest.LastName,
                    ContactPerson = studentRequest.ContactPerson,
                    ContactNo = studentRequest.ContactNo,
                    EmailAddress = studentRequest.EmailAddress,
                    DateOfBirth = studentRequest.DateOfBirth,
                    ClassroomId = studentRequest.ClassroomId,
                };

                await _context.Students.AddAsync(req);
                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Student created!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateStudent([FromRoute] int id, [FromBody] StudentRequestDto studentRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var student = await _context.Students.FirstOrDefaultAsync(i => i.StudentId == id);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                var existingClassroom = await _context.Classrooms.FirstOrDefaultAsync(c => c.ClassroomId == studentRequest.ClassroomId);

                if (existingClassroom == null)
                {
                    return BadRequest(new { message = "Classroom not found" });
                }

                student.FirstName = studentRequest.FirstName;
                student.LastName = studentRequest.LastName;
                student.ContactPerson = studentRequest.ContactPerson;
                student.ContactNo = studentRequest.ContactNo;
                student.EmailAddress = studentRequest.EmailAddress;
                student.DateOfBirth = studentRequest.DateOfBirth;
                student.ClassroomId = studentRequest.ClassroomId;

                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Student updated!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
        {
            try
            {
                var student = await _context.Students.FirstOrDefaultAsync(i => i.StudentId == id);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                _context.Students.Remove(student);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}