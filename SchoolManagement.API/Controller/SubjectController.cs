using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos.RequestDtos;
using SchoolManagement.API.Data.Dtos.ResponseDtos;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{

    [ApiController]
    [Route("/api/subjects")]
    public class SubjectController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public SubjectController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubjects()
        {
            var subjects = await _context.Subjects
            .Select(c => new SubjectResponseDto
            {
                SubjectId = c.SubjectId,
                SubjectName = c.SubjectName,
            }).ToListAsync();
            return Ok(subjects);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSingleClassroom([FromRoute] int id)
        {
            var subject = await _context.Subjects
            .Select(c => new SubjectResponseDto
            {
                SubjectId = c.SubjectId,
                SubjectName = c.SubjectName,
            })
            .FirstOrDefaultAsync(i => i.SubjectId == id);

            if (subject == null)
            {
                return NotFound(new { message = "Subject not found." });
            }

            return Ok(subject);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] SubjectRequestDto subjectRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Subject req = new Subject
            {
                SubjectName = subjectRequest.SubjectName,
            };

            await _context.Subjects.AddAsync(req);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Subject created!" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateClassroom([FromRoute] int id, [FromBody] SubjectRequestDto subjectRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = await _context.Subjects.FirstOrDefaultAsync(i => i.SubjectId == id);

            if (subject == null)
            {
                return NotFound(new { message = "Subject not found" });
            }

            subject.SubjectName = subjectRequest.SubjectName;

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Subject updated!" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSubject([FromRoute] int id)
        {
            var subject = await _context.Subjects.FirstOrDefaultAsync(i => i.SubjectId == id);

            if (subject == null)
            {
                return NotFound(new { message = "Subject not found" });
            }

            _context.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}