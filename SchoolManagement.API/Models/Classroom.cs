namespace SchoolManagement.API.Models
{
    public class Classroom
    {
        public int ClassroomId { get; set; }
        public string ClassroomName { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}