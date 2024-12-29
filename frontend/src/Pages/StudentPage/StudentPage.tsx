import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import StudentForm from "../../Components/Student/StudentForm";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
} from "../../redux/api/studentApi";

const StudentPage = () => {
  const { data, error, isLoading, isError } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const headers = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "contactNo", label: "Contact Number" },
    { key: "emailAddress", label: "Email Address" },
    { key: "dateOfBirth", label: "Date Of Birth" },
    { key: "age", label: "Age" },
    { key: "classroomName", label: "Classroom" },
  ];

  const handleEdit = (student: any) => {
    console.log("Edit student:", student);
  };

  const handleDelete = async (student: any) => {
    try {
      // Delete the student
      await deleteStudent(student.studentId).unwrap(); // This will trigger cache invalidation
    } catch (error) {
      console.error("Failed to delete student: ", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading students: {error?.message}</p>;
  return (
    <Container>
      {/* Form  */}
      <StudentForm />
      {/* Table */}
      <DataTable
        title="Teacher List"
        headers={headers}
        data={data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
};
export default StudentPage;
