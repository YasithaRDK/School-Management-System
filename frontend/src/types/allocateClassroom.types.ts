// Interface representing the structure of an allocated classroom
export interface Classroom {
  classroomId: number;
  classroomName: string;
}

export interface IAllocateClassroom {
  teacherId: number;
  teacherName: string;
  classrooms: Classroom[];
}

// Interface for creating a new allocation request
export interface IAllocateClassroomRequest {
  teacherId: number;
  classroomId: number;
}
