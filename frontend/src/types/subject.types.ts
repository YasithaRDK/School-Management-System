// Define the Subject data structure for better type safety
export interface ISubject {
  subjectId: number;
  subjectName: string;
}

// Define the payload structure for updating a subject
export interface ISubjectUpdatePayload {
  id: number;
  data: Partial<ISubject>;
}
