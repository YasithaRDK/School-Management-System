using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.API.Models
{
    public class Subject
    {
        [Key]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Subject Name is required")]
        [MaxLength(100, ErrorMessage = "Subject Name cannot exceed 100 characters.")]
        public string SubjectName { get; set; }
    }
}