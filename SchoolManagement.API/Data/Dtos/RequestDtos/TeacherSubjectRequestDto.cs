using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagement.API.Data.Dtos.RequestDtos
{
    public class TeacherSubjectRequestDto
    {
        [Required(ErrorMessage = "Teacher Id is required")]
        [ForeignKey("Teacher")]
        public int TeacherId { get; set; }

        [Required(ErrorMessage = "Subject Id is required")]
        [ForeignKey("Subject")]
        public int SubjectId { get; set; }
    }
}