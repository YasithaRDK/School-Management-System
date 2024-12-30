// Define the Classroom data structure for better type safety
export interface IClassroom {
  classroomId: number;
  classroomName: string;
}

// Define the payload structure for updating a classroom
export interface IClassroomUpdatePayload {
  id: number;
  data: Partial<IClassroom>;
}
