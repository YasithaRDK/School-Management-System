using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.API.Data.Dtos.RequestDtos
{
    public class ClassroomRequestDto
    {
        [Required(ErrorMessage = "Classroom Name is required")]
        [MaxLength(50, ErrorMessage = "Classroom Name cannot exceed 50 characters.")]
        public string ClassroomName { get; set; }
    }
}