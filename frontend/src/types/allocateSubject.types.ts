// Interface representing the structure of an allocated subject
export interface Subject {
  subjectId: number;
  subjectName: string;
}

export interface IAllocateSubject {
  teacherId: number;
  teacherName: string;
  subjects: Subject[];
}

// Interface for creating a new allocation request
export interface IAllocateSubjectRequest {
  teacherId: number;
  subjectId: number;
}
