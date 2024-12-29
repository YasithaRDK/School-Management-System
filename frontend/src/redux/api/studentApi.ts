import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5215/api/" }),
  tagTypes: ["Student"],
  endpoints: (builder) => ({
    getStudents: builder.query<any[], void>({
      query: () => "students",
      providesTags: [{ type: "Student" }],
    }),
    getStudentById: builder.query<any, number>({
      query: (id) => `students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),
    createStudent: builder.mutation<any, any>({
      query: (newStudent) => ({
        url: "students",
        method: "POST",
        body: newStudent,
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
    deleteStudent: builder.mutation<any, number>({
      query: (id) => ({
        url: `students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Student" }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
