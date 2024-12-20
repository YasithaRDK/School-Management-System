namespace SchoolManagement.API.Models
{
    public class TeacherClassroom
    {
        public int TeacherId { get; set; } // Foreign Key
        public Teacher Teacher { get; set; }
        public int ClassroomId { get; set; } // Foreign Key
        public Classroom Classroom { get; set; }
    }
}