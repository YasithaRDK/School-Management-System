import { configureStore } from "@reduxjs/toolkit";
import { studentApi } from "./api/studentApi";
import { classroomApi } from "./api/classroomApi";

export const store = configureStore({
  reducer: {
    [studentApi.reducerPath]: studentApi.reducer,
    [classroomApi.reducerPath]: classroomApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      studentApi.middleware,
      classroomApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
