using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Data.Dtos;
using SchoolManagement.API.Interfaces;
using SchoolManagement.API.Models;

namespace SchoolManagement.API.Controller
{
    [ApiController]
    [Route("/api/subjects")]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectRepository _subjectRepository;
        public SubjectController(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubjects()
        {
            try
            {
                var subjects = await _subjectRepository.GetAllSubjectsAsync();

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
                var subject = await _subjectRepository.GetSubjectByIdAsync(id);

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

                await _subjectRepository.AddSubjectAsync(req);

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
                var subject = await _subjectRepository.GetSubjectByIdAsync(id);

                if (subject == null)
                {
                    return NotFound(new { message = "Subject not found" });
                }

                subject.SubjectName = subjectRequest.SubjectName;

                await _subjectRepository.UpdateSubjectAsync(subject);

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
                var subject = await _subjectRepository.GetSubjectByIdAsync(id);

                if (subject == null)
                {
                    return NotFound(new { message = "Subject not found" });
                }

                await _subjectRepository.DeleteSubjectAsync(subject);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}