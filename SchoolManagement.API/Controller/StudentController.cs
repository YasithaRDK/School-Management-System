using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/students")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IClassroomRepository _classroomRepository;
        public StudentController(IStudentRepository studentRepository, IClassroomRepository classroomRepository)
        {
            _studentRepository = studentRepository;
            _classroomRepository = classroomRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var students = await _studentRepository.GetAllStudentsAsync();

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
                var student = await _studentRepository.GetStudentByIdAsync(id);

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
                var existingClassroom = await _classroomRepository.ClassroomExistsAsync(studentRequest.ClassroomId);

                if (!existingClassroom)
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

                await _studentRepository.AddStudentAsync(req);

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
                var student = await _studentRepository.GetStudentByIdAsync(id);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                var existingClassroom = await _classroomRepository.ClassroomExistsAsync(studentRequest.ClassroomId);

                if (!existingClassroom)
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

                await _studentRepository.UpdateStudentAsync(student);

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
                var student = await _studentRepository.GetStudentByIdAsync(id);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                await _studentRepository.DeleteStudentAsync(student);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}