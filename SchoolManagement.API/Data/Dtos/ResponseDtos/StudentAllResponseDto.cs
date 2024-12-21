namespace SchoolManagement.API.Data.Dtos.ResponseDtos
{
    public class StudentAllResponseDto
    {
        public int StudentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNo { get; set; }
        public string EmailAddress { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
        public string ClassroomName { get; set; }
    }
}