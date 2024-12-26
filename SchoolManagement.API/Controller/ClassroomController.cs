using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
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
            try
            {
                var classrooms = await _context.Classrooms
            .ToListAsync();

                var response = classrooms.Select(classroom => new
                {
                    ClassroomId = classroom.ClassroomId,
                    ClassroomName = classroom.ClassroomName,
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSingleClassroom([FromRoute] int id)
        {
            try
            {
                var classroom = await _context.Classrooms
            .FirstOrDefaultAsync(i => i.ClassroomId == id);

                if (classroom == null)
                {
                    return NotFound(new { message = "Classroom not found." });
                }

                var response = new
                {
                    ClassroomId = classroom.ClassroomId,
                    ClassroomName = classroom.ClassroomName,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] ClassroomRequestDto classroomRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Classroom req = new Classroom
                {
                    ClassroomName = classroomRequest.ClassroomName,
                };

                await _context.Classrooms.AddAsync(req);
                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Classroom created!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateClassroom([FromRoute] int id, [FromBody] ClassroomRequestDto classroomRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var classroom = await _context.Classrooms.FirstOrDefaultAsync(i => i.ClassroomId == id);

                if (classroom == null)
                {
                    return NotFound(new { message = "Classroom not found" });
                }

                classroom.ClassroomName = classroomRequest.ClassroomName;

                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Classroom updated!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteClassroom([FromRoute] int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}