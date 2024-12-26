using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/classrooms")]
    public class ClassroomController : ControllerBase
    {
        private readonly IClassroomRepository _classroomRepository;
        public ClassroomController(IClassroomRepository classroomRepository)
        {
            _classroomRepository = classroomRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClassrooms()
        {
            try
            {
                var classrooms = await _classroomRepository.GetAllClassroomsAsync();

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
                var classroom = await _classroomRepository.GetClassroomByIdAsync(id);

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

                await _classroomRepository.AddClassroomAsync(req);

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
                var classroom = await _classroomRepository.GetClassroomByIdAsync(id);

                if (classroom == null)
                {
                    return NotFound(new { message = "Classroom not found" });
                }

                classroom.ClassroomName = classroomRequest.ClassroomName;

                await _classroomRepository.UpdateClassroomAsync(classroom);

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
                var classroom = await _classroomRepository.GetClassroomByIdAsync(id);

                if (classroom == null)
                {
                    return NotFound(new { message = "Classroom not found" });
                }

                await _classroomRepository.DeleteClassroomAsync(classroom);

                return NoContent();
            }
            catch (DbUpdateException ex) when (ex.InnerException is SqlException sqlEx && sqlEx.Number == 547)
            {
                return BadRequest(new { message = "Cannot delete the classroom because it is associated with other entities (e.g., students)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}