// Define the Teacher data structure for better type safety
export interface ITeacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  emailAddress: string;
}

// Define the payload structure for updating a teacher
export interface ITeacherUpdatePayload {
  id: number;
  data: Partial<ITeacher>;
}
