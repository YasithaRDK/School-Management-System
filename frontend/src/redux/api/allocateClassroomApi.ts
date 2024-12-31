import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IAllocateClassroom,
  IAllocateClassroomRequest,
} from "../../types/allocateClassroom.types";

// API slice for managing allocateClassrooms
export const allocateClassroomApi = createApi({
  reducerPath: "allocateClassroomApi", // Unique key for the API slice
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_URL, // Use environment variable for base URL
  }),
  tagTypes: ["AllocateClassroom"], // Tag for cache invalidation
  endpoints: (builder) => ({
    // Fetch allocated classrooms for a specific teacher by teacherId
    getAllocateClassroomsByTeacherId: builder.query<IAllocateClassroom, number>(
      {
        query: (teacherId) => `teacher-classrooms/${teacherId}`,
        providesTags: (result, error, teacherId) => [
          { type: "AllocateClassroom", id: teacherId },
        ],
      }
    ),

    // Allocate a classroom to a teacher
    createAllocateClassroom: builder.mutation<void, IAllocateClassroomRequest>({
      query: (data) => ({
        url: "teacher-classrooms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "AllocateClassroom" }],
    }),

    // Delete an allocated classroom by teacherId and classroomId
    deleteAllocateClassroom: builder.mutation<
      void,
      { teacherId: number; classroomId: number }
    >({
      query: ({ teacherId, classroomId }) => ({
        url: `teacher-classrooms/${teacherId}/${classroomId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teacherId, classroomId }) => [
        { type: "AllocateClassroom", id: teacherId },
        { type: "AllocateClassroom", id: classroomId },
      ],
    }),
  }),
});

// Export hooks generated by the API slice
export const {
  useGetAllocateClassroomsByTeacherIdQuery,
  useCreateAllocateClassroomMutation,
  useDeleteAllocateClassroomMutation,
} = allocateClassroomApi;