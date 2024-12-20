namespace SchoolManagement.API.Models
{
    public class TeacherSubject
    {
        public int TeacherId { get; set; } // Foreign Key
        public Teacher Teacher { get; set; }
        public int SubjectId { get; set; } // Foreign Key
        public Classroom Subject { get; set; }
    }
}