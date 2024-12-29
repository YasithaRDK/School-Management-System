import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classroomApi = createApi({
  reducerPath: "classroomApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5215/api/" }),
  tagTypes: ["Classroom"],
  endpoints: (builder) => ({
    getClassrooms: builder.query<any[], void>({
      query: () => "classrooms",
      providesTags: [{ type: "Classroom" }],
    }),
    getClassroomById: builder.query<any, number>({
      query: (id) => `classrooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Classroom", id }],
    }),
    createClassroom: builder.mutation<any, any>({
      query: (newClassroom) => ({
        url: "classrooms",
        method: "POST",
        body: newClassroom,
      }),
      invalidatesTags: [{ type: "Classroom" }],
    }),
    deleteClassroom: builder.mutation<any, number>({
      query: (id) => ({
        url: `classrooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Classroom" }],
    }),
  }),
});

export const {
  useGetClassroomsQuery,
  useGetClassroomByIdQuery,
  useCreateClassroomMutation,
  useDeleteClassroomMutation,
} = classroomApi;
