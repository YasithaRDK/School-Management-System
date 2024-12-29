import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import StudentPage from "../Pages/StudentPage/StudentPage";
import TeacherPage from "../Pages/TeacherPage/TeacherPage";
import SubjectPage from "../Pages/SubjectPage/SubjectPage";
import ClassroomPage from "../Pages/ClassroomPage/ClassroomPage";
import AllocateClassroomPage from "../Pages/AllocateClassroomPage/AllocateClassroomPage";
import AllocateSubjectPage from "../Pages/AllocateSubjectPage/AllocateSubjectPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "students", element: <StudentPage /> },
      { path: "teachers", element: <TeacherPage /> },
      { path: "subjects", element: <SubjectPage /> },
      { path: "classrooms", element: <ClassroomPage /> },
      { path: "allocate-classrooms", element: <AllocateClassroomPage /> },
      { path: "allocate-subjects", element: <AllocateSubjectPage /> },
    ],
  },
]);
