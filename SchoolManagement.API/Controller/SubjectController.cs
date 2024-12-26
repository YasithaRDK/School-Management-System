using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data;
using SchoolManagement.API.Data.Dtos;
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
            try
            {
                var subjects = await _context.Subjects
            .ToListAsync();

                var response = subjects.Select(subject => new
                {
                    SubjectId = subject.SubjectId,
                    SubjectName = subject.SubjectName
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSingleSubject([FromRoute] int id)
        {
            try
            {
                var subject = await _context.Subjects
            .FirstOrDefaultAsync(i => i.SubjectId == id);

                if (subject == null)
                {
                    return NotFound(new { message = "Subject not found." });
                }

                var response = new
                {
                    SubjectId = subject.SubjectId,
                    SubjectName = subject.SubjectName
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubject([FromBody] SubjectRequestDto subjectRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Subject req = new Subject
                {
                    SubjectName = subjectRequest.SubjectName,
                };

                await _context.Subjects.AddAsync(req);
                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Subject created!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSubject([FromRoute] int id, [FromBody] SubjectRequestDto subjectRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var subject = await _context.Subjects.FirstOrDefaultAsync(i => i.SubjectId == id);

                if (subject == null)
                {
                    return NotFound(new { message = "Subject not found" });
                }

                subject.SubjectName = subjectRequest.SubjectName;

                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Subject updated!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSubject([FromRoute] int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}