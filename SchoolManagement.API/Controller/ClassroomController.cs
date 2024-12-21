using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
using SchoolManagement.API.Data.Dtos.ResponseDtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/classrooms")]
    public class ClassroomController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public ClassroomController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClassrooms()
        {
            var classrooms = await _context.Classrooms
            .Select(c => new ClassroomResponseDto
            {
                ClassroomId = c.ClassroomId,
                ClassroomName = c.ClassroomName,
            }).ToListAsync();
            return Ok(classrooms);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSingleClassroom([FromRoute] int id)
        {
            var classroom = await _context.Classrooms
            .Select(c => new ClassroomResponseDto
            {
                ClassroomId = c.ClassroomId,
                ClassroomName = c.ClassroomName,
            })
            .FirstOrDefaultAsync(i => i.ClassroomId == id);

            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found." });
            }

            return Ok(classroom);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] ClassroomRequestDto classroomRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Classroom req = new Classroom
            {
                ClassroomName = classroomRequest.ClassroomName,
            };

            await _context.Classrooms.AddAsync(req);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Classroom created!" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateClassroom([FromRoute] int id, [FromBody] ClassroomRequestDto classroomRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classroom = await _context.Classrooms.FirstOrDefaultAsync(i => i.ClassroomId == id);

            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found" });
            }

            classroom.ClassroomName = classroomRequest.ClassroomName;

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Classroom updated!" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteClassroom([FromRoute] int id)
        {
            var classroom = await _context.Classrooms.FirstOrDefaultAsync(i => i.ClassroomId == id);

            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found" });
            }

            _context.Remove(classroom);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}