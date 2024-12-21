using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
using SchoolManagement.API.Data.Dtos.ResponseDtos;
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
            var students = await _context.Students
            .Select(s => new StudentAllResponseDto
            {
                StudentId = s.StudentId,
                FirstName = s.FirstName,
                LastName = s.LastName,
                ContactPerson = s.ContactPerson,
                ContactNo = s.ContactNo,
                EmailAddress = s.EmailAddress,
                DateOfBirth = s.DateOfBirth,
                Age = s.Age,
                ClassroomName = s.Classroom.ClassroomName
            }).ToListAsync();
            return Ok(students);
        }


        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] StudentRequestDto studentRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateStudent([FromRoute] int id, [FromBody] StudentRequestDto studentRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = await _context.Students.FirstOrDefaultAsync(i => i.StudentId == id);

            if (student == null)
            {
                return NotFound(new { message = "Student not found." });
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStudent([FromRoute] int id)
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
    }
}