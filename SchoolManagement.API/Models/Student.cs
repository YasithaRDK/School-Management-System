using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagement.API.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "First Name is Required")]
        [MaxLength(50, ErrorMessage = "First Name cannot exceed 50 characters.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is Required")]
        [MaxLength(50, ErrorMessage = "Last Name cannot exceed 50 characters.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Contacted Person is Required")]
        [MaxLength(50, ErrorMessage = "Contact Person cannot exceed 50 characters.")]
        public string ContactPerson { get; set; }

        [Required(ErrorMessage = "Contact Number is Required")]
        [MaxLength(10, ErrorMessage = "Contact No cannot exceed 10 characters.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact No must be a 10-digit number")]
        public string ContactNo { get; set; }

        [Required(ErrorMessage = "Email Address is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format.")]
        public string EmailAddress { get; set; }

        [Required(ErrorMessage = "Date of Birth is required.")]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [NotMapped]
        public int Age => DateTime.Now.Year - DateOfBirth.Year;

        [Required(ErrorMessage = "Classroom is required")]
        public int ClassroomId { get; set; }

        [ForeignKey("ClassroomId")]
        public Classroom Classroom { get; set; }
    }
}