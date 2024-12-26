using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagement.API.Data.Dtos
{
    public class SubjectRequestDto
    {
        [Required(ErrorMessage = "Subject Name is required")]
        [MaxLength(100, ErrorMessage = "Subject Name cannot exceed 100 characters.")]
        public string SubjectName { get; set; }
    }
}