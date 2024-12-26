using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/teachers")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherRepository _teacherRepo;
        public TeacherController(ITeacherRepository teacherrepo)
        {
            _teacherRepo = teacherrepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTeachers()
        {
            try
            {
                var teachers = await _teacherRepo.GetAllTeachersAsync();

                var response = teachers.Select(teacher => new
                {
                    TeacherId = teacher.TeacherId,
                    FirstName = teacher.FirstName,
                    LastName = teacher.LastName,
                    EmailAddress = teacher.EmailAddress,
                    ContactNo = teacher.ContactNo,
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
                var teacher = await _teacherRepo.GetTeacherByIdAsync(id);

                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found." });
                }

                var response = new
                {
                    TeacherId = teacher.TeacherId,
                    FirstName = teacher.FirstName,
                    LastName = teacher.LastName,
                    EmailAddress = teacher.EmailAddress,
                    ContactNo = teacher.ContactNo,
                };

                return Ok(response);
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] TeacherRequestDto teacherRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Teacher req = new Teacher
                {
                    FirstName = teacherRequest.FirstName,
                    LastName = teacherRequest.LastName,
                    EmailAddress = teacherRequest.EmailAddress,
                    ContactNo = teacherRequest.ContactNo,
                };

                await _teacherRepo.AddTeacherAsync(req);

                return StatusCode(201, new { message = "Teacher created!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateClassroom([FromRoute] int id, [FromBody] TeacherRequestDto teacherRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var teacher = await _teacherRepo.GetTeacherByIdAsync(id);

                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                teacher.FirstName = teacherRequest.FirstName;
                teacher.LastName = teacherRequest.LastName;
                teacher.EmailAddress = teacherRequest.EmailAddress;
                teacher.ContactNo = teacherRequest.ContactNo;

                await _teacherRepo.UpdateTeacherAsync(teacher);

                return StatusCode(201, new { message = "Teacher updated!" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTeacher([FromRoute] int id)
        {
            try
            {
                var teacher = await _teacherRepo.GetTeacherByIdAsync(id);

                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                await _teacherRepo.DeleteTeacherAsync(teacher);

                return NoContent();
            }
            catch
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}