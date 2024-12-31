// Define the Student data structure for better type safety
export interface IStudent {
  studentId: number;
  firstName: string;
  lastName: string;
  contactPerson: string;
  contactNo: string;
  emailAddress: string;
  dateOfBirth: string;
  classroomId: string;
  classroomName: string;
}

// Define the payload structure for updating a student
export interface IStudentUpdatePayload {
  id: number;
  data: Partial<IStudent>;
}
