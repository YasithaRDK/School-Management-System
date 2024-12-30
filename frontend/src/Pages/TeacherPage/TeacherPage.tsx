import { Container } from "react-bootstrap";
import TeacherForm from "../../Components/Teacher/TeacherForm";
import DataTable from "../../Components/DataTable/DataTable";
import { useCallback, useState } from "react";
import {
  useDeleteTeacherMutation,
  useGetTeachersQuery,
} from "../../redux/api/teacher.Api";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";

const TeacherPage = () => {
  // State for the selected teacher and deleting state
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<number | null>(
    null
  );

  // Fetch teachers data
  const { data: teachers, error, isLoading, isError } = useGetTeachersQuery();

  // Delete teacher mutation
  const [deleteTeacher] = useDeleteTeacherMutation();

  // DataTable column definitions
  const headers = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "contactNo", label: "Contact Number" },
    { key: "emailAddress", label: "Email Address" },
  ];

  // Set selected teacher for editing
  const handleEdit = useCallback((teacher: any) => {
    setSelectedTeacher(teacher);
  }, []);

  // Handle teacher deletion
  const handleDelete = async (teacher: any) => {
    setDeletingTeacherId(teacher.teacherId);
    try {
      await deleteTeacher(teacher.teacherId).unwrap();
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      toast.error("Something went wrong! Try again.");
    } finally {
      setDeletingTeacherId(null);
    }
  };

  // Render loader if data is being fetched
  if (isLoading) return <Loader />;

  // Render error message if fetching data fails
  if (isError) {
    toast.error("Failed to load teachers data.");
    console.error("Error fetching teachers:", error);
    return null;
  }

  return (
    <Container>
      {/* Form for adding or editing teacher */}
      <TeacherForm
        teacher={selectedTeacher}
        setSelectedTeacher={setSelectedTeacher}
      />

      {/* Table for listing teachers */}
      <DataTable
        title="Teacher List"
        headers={headers}
        data={teachers || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={deletingTeacherId}
        actionButtons
        idKey="teacherId"
      />
    </Container>
  );
};
export default TeacherPage;
