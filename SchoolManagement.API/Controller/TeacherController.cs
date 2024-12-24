using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
using SchoolManagement.API.Data.Dtos.ResponseDtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/teachers")]
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public TeacherController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await _context.Teachers
            .Select(c => new TeacherResponseDto
            {
                TeacherId = c.TeacherId,
                FirstName = c.FirstName,
                LastName = c.LastName,
                EmailAddress = c.EmailAddress,
                ContactNo = c.ContactNo,
            }).ToListAsync();
            return Ok(teachers);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSingleClassroom([FromRoute] int id)
        {
            var teacher = await _context.Teachers
            .Select(c => new TeacherResponseDto
            {
                TeacherId = c.TeacherId,
                FirstName = c.FirstName,
                LastName = c.LastName,
                EmailAddress = c.EmailAddress,
                ContactNo = c.ContactNo,
            })
            .FirstOrDefaultAsync(i => i.TeacherId == id);

            if (teacher == null)
            {
                return NotFound(new { message = "Teacher not found." });
            }

            return Ok(teacher);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] TeacherRequestDto teacherRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Teacher req = new Teacher
            {
                FirstName = teacherRequest.FirstName,
                LastName = teacherRequest.LastName,
                EmailAddress = teacherRequest.EmailAddress,
                ContactNo = teacherRequest.ContactNo,
            };

            await _context.Teachers.AddAsync(req);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Teacher created!" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateClassroom([FromRoute] int id, [FromBody] TeacherRequestDto teacherRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var teacher = await _context.Teachers.FirstOrDefaultAsync(i => i.TeacherId == id);

            if (teacher == null)
            {
                return NotFound(new { message = "Teacher not found" });
            }

            teacher.FirstName = teacherRequest.FirstName;
            teacher.LastName = teacherRequest.LastName;
            teacher.EmailAddress = teacherRequest.EmailAddress;
            teacher.ContactNo = teacherRequest.ContactNo;

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Teacher updated!" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTeacher([FromRoute] int id)
        {
            var teacher = await _context.Teachers.FirstOrDefaultAsync(i => i.TeacherId == id);

            if (teacher == null)
            {
                return NotFound(new { message = "Teacher not found" });
            }

            _context.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}