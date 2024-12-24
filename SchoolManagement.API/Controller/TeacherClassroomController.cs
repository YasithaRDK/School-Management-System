using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
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
            .GroupBy(tc => new
            {
                tc.Teacher.TeacherId,
                TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName
            })
            .Select(g => new
            {
                TeacherId = g.Key.TeacherId,
                TeacherName = g.Key.TeacherName,
                Classrooms = g.Select(ts => new
                {
                    ClassroomId = ts.Classroom.ClassroomId,
                    ClassroomName = ts.Classroom.ClassroomName
                }).ToList()
            })
            .ToListAsync();

            return Ok(teacherClassrooms);
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateClassroomsOfTeacher([FromRoute] int teacherId)
        {
            var teacherClassrooms = await _context.TeacherClassrooms
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
                    Classrooms = g.Select(ts => new
                    {
                        ClassroomId = ts.Classroom.ClassroomId,
                        ClassroomName = ts.Classroom.ClassroomName
                    }).ToList()
                })
                .ToListAsync();

            if (teacherClassrooms == null)
            {
                return NotFound();
            }

            return Ok(teacherClassrooms);
        }

        [HttpPost]
        public async Task<IActionResult> AllocateClassroom([FromBody] TeacherClassroomRequestDto teacherClassroom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

            TeacherClassroom req = new TeacherClassroom
            {
                TeacherId = teacherClassroom.TeacherId,
                ClassroomId = teacherClassroom.ClassroomId,
            };

            await _context.TeacherClassrooms.AddAsync(req);

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "The classroom assigned to the teacher" });
        }

        [HttpDelete("{teacherId:int}/{classroomId:int}")]
        public async Task<IActionResult> DeleteAllocateClassroom([FromRoute] int teacherId, [FromRoute] int classroomId)
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
    }
}