using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.API.Data.Dtos.RequestDtos
{
    public class StudentRequestDto
    {
        [Required(ErrorMessage = "First Name is required.")]
        [MaxLength(50, ErrorMessage = "First Name cannot exceed 50 characters.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required.")]
        [MaxLength(50, ErrorMessage = "Last Name cannot exceed 50 characters.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Contact Person is required.")]
        [MaxLength(50, ErrorMessage = "Contact Person cannot exceed 50 characters.")]
        public string ContactPerson { get; set; }

        [Required(ErrorMessage = "Contact No is required.")]
        [MaxLength(10, ErrorMessage = "Contact No cannot exceed 10 characters.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact No must be a 10-digit number")]
        public string ContactNo { get; set; }

        [Required(ErrorMessage = "Email Address is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format.")]
        public string EmailAddress { get; set; }

        [Required(ErrorMessage = "Date of Birth is required.")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Classroom ID is required.")]
        public int ClassroomId { get; set; }
    }
}