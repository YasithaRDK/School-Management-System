using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("api/teacher-classrooms")]

    public class TeacherClassroomController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public TeacherClassroomController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAllocateClassrooms()
        {
            var teacherClassrooms = await _context.TeacherClassrooms
            .Include(tc => tc.Teacher)
            .Include(tc => tc.Classroom)
            .ToListAsync();

            var response = teacherClassrooms.Select(teacherClassroom => new
            {
                TeacherId = teacherClassroom.Teacher.TeacherId,
                TeacherName = teacherClassroom.Teacher.FirstName + " " + teacherClassroom.Teacher.LastName,
                ClassroomId = teacherClassroom.Classroom.ClassroomId,
                ClassroomName = teacherClassroom.Classroom.ClassroomName
            });

            return Ok(response);
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateClassroomsOfTeacher([FromRoute] int teacherId)
        {
            try
            {
                var teacherClassrooms = await _context.TeacherClassrooms
                .Where(tc => tc.TeacherId == teacherId)
                .Include(tc => tc.Teacher)
                .Include(tc => tc.Classroom)
                .Select(tc => new
                {
                    TeacherId = tc.Teacher.TeacherId,
                    TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName,
                    ClassroomId = tc.Classroom.ClassroomId,
                    ClassroomName = tc.Classroom.ClassroomName
                })
                .ToListAsync();

                if (!teacherClassrooms.Any())
                {
                    return NotFound();
                }

                var response = new
                {
                    TeacherId = teacherClassrooms.First().TeacherId,
                    TeacherName = teacherClassrooms.First().TeacherName,
                    Classrooms = teacherClassrooms.Select(c => new
                    {
                        ClassroomId = c.ClassroomId,
                        ClassroomName = c.ClassroomName
                    })
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AllocateClassroom([FromBody] TeacherClassroomRequestDto teacherClassroom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.TeacherId == teacherClassroom.TeacherId);

                if (teacher == null)
                {
                    return BadRequest(new { message = "Teacher not found" });
                }

                var classroom = await _context.Classrooms.FirstOrDefaultAsync(c => c.ClassroomId == teacherClassroom.ClassroomId);

                if (classroom == null)
                {
                    return BadRequest(new { message = "Classroom not found" });
                }

                var existingTeacherClassroom = await _context.TeacherClassrooms
                .FirstOrDefaultAsync(tc => tc.TeacherId == teacherClassroom.TeacherId && tc.ClassroomId == teacherClassroom.ClassroomId);

                if (existingTeacherClassroom != null)
                {
                    return Conflict(new { message = "This classroom is already assigned to the teacher" });
                }

                TeacherClassroom req = new TeacherClassroom
                {
                    TeacherId = teacherClassroom.TeacherId,
                    ClassroomId = teacherClassroom.ClassroomId,
                };

                await _context.TeacherClassrooms.AddAsync(req);

                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "The classroom assigned to the teacher" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpDelete("{teacherId:int}/{classroomId:int}")]
        public async Task<IActionResult> DeleteAllocateClassroom([FromRoute] int teacherId, [FromRoute] int classroomId)
        {
            try
            {
                var teacherClassroom = await _context.TeacherClassrooms.FirstOrDefaultAsync(ts => ts.TeacherId == teacherId && ts.ClassroomId == classroomId);

                if (teacherClassroom == null)
                {
                    return NotFound();
                }

                _context.TeacherClassrooms.Remove(teacherClassroom);
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