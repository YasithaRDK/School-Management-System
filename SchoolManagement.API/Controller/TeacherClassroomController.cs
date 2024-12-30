using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [EnableCors("AllowAllOrigins")]
    [ApiController]
    [Route("api/teacher-classrooms")]

    public class TeacherClassroomController : ControllerBase
    {
        private readonly ITeacherClassroomRepository _teacherClassroomRepo;
        private readonly ITeacherRepository _teacherRepo;
        private readonly IClassroomRepository _classroomRepo;
        public TeacherClassroomController(ITeacherClassroomRepository teacherClassroomRepo, ITeacherRepository teacherRepo, IClassroomRepository classroomRepo)
        {
            _teacherClassroomRepo = teacherClassroomRepo;
            _teacherRepo = teacherRepo;
            _classroomRepo = classroomRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAllocateClassrooms()
        {
            try
            {
                var teacherClassrooms = await _teacherClassroomRepo.GetAllAllocateClassroomsAsync();

                var response = teacherClassrooms.Select(tc => new
                {
                    TeacherId = tc.Teacher.TeacherId,
                    TeacherName = tc.Teacher.FirstName + " " + tc.Teacher.LastName,
                    ClassroomId = tc.Classroom.ClassroomId,
                    ClassroomName = tc.Classroom.ClassroomName
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("{teacherId:int}")]
        public async Task<IActionResult> GetAllocateClassroomsOfTeacher([FromRoute] int teacherId)
        {
            try
            {
                var teacherClassrooms = await _teacherClassroomRepo.GetAllocateClassroomsOfTeacherAsync(teacherId);

                if (!teacherClassrooms.Any())
                {
                    return NotFound();
                }

                var response = new
                {
                    TeacherId = teacherClassrooms.First().TeacherId,
                    TeacherName = teacherClassrooms.First().Teacher.FirstName + " " + teacherClassrooms.First().Teacher.LastName,
                    Classrooms = teacherClassrooms.Select(c => new
                    {
                        ClassroomId = c.Classroom.ClassroomId,
                        ClassroomName = c.Classroom.ClassroomName
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
                var teacher = await _teacherRepo.TeacherExistsAsync(teacherClassroom.TeacherId);

                if (!teacher)
                {
                    return BadRequest(new { message = "Teacher not found" });
                }

                var classroom = await _classroomRepo.ClassroomExistsAsync(teacherClassroom.ClassroomId);

                if (!classroom)
                {
                    return BadRequest(new { message = "Classroom not found" });
                }

                var existingTeacherClassroom = await _teacherClassroomRepo.GetTeacherClassroomAsync(teacherClassroom.TeacherId, teacherClassroom.ClassroomId);

                if (existingTeacherClassroom != null)
                {
                    return Conflict(new { message = "This classroom is already assigned to the teacher" });
                }

                TeacherClassroom req = new TeacherClassroom
                {
                    TeacherId = teacherClassroom.TeacherId,
                    ClassroomId = teacherClassroom.ClassroomId,
                };

                await _teacherClassroomRepo.AddTeacherClassroomAsync(req);

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
                var teacherClassroom = await _teacherClassroomRepo.GetTeacherClassroomAsync(teacherId, classroomId);

                if (teacherClassroom == null)
                {
                    return NotFound();
                }

                await _teacherClassroomRepo.DeleteTeacherClassroomAsync(teacherClassroom);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}