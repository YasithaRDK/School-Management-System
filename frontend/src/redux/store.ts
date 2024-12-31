import { configureStore } from "@reduxjs/toolkit";
import { studentApi } from "./api/studentApi";
import { classroomApi } from "./api/classroomApi";
import { teacherApi } from "./api/teacher.Api";
import { subjectApi } from "./api/subjectApi";
import { allocateSubjectApi } from "./api/allocateSubjectApi";

export const store = configureStore({
  reducer: {
    [studentApi.reducerPath]: studentApi.reducer,
    [classroomApi.reducerPath]: classroomApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [allocateSubjectApi.reducerPath]: allocateSubjectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      studentApi.middleware,
      classroomApi.middleware,
      teacherApi.middleware,
      subjectApi.middleware,
      allocateSubjectApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
