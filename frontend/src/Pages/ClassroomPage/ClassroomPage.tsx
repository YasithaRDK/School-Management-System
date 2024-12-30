import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import ClassroomForm from "../../Components/Classroom/ClassroomForm";
import { useCallback, useState } from "react";
import {
  useDeleteClassroomMutation,
  useGetClassroomsQuery,
} from "../../redux/api/classroomApi";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";

const ClassroomPage = () => {
  // State for the selected classroom and deleting state
  const [selectedClassroom, setSelectedClassroom] = useState<any | null>(null);
  const [deletingClassroomId, setDeletingClassroomId] = useState<number | null>(
    null
  );

  // Fetch classrooms data
  const {
    data: classrooms,
    error,
    isLoading,
    isError,
  } = useGetClassroomsQuery();

  // Delete classroom mutation
  const [deleteClassroom] = useDeleteClassroomMutation();

  // DataTable column definitions
  const headers = [{ key: "classroomName", label: "Classroom Name" }];

  // Set selected classroom for editing
  const handleEdit = useCallback((classroom: any) => {
    setSelectedClassroom(classroom);
  }, []);

  // Handle classroom deletion
  const handleDelete = async (classroom: any) => {
    setDeletingClassroomId(classroom.classroomId);
    try {
      await deleteClassroom(classroom.classroomId).unwrap();
      toast.success("Classroom deleted successfully!");
    } catch (error) {
      console.error("Failed to delete classroom:", error);
      toast.error("Something went wrong! Try again.");
    } finally {
      setDeletingClassroomId(null);
    }
  };

  // Render loader if data is being fetched
  if (isLoading) return <Loader />;

  // Render error message if fetching data fails
  if (isError) {
    toast.error("Failed to load classrooms data.");
    console.error("Error fetching classrooms:", error);
    return null;
  }

  return (
    <Container>
      {/* Form  */}
      <ClassroomForm
        classroom={selectedClassroom}
        setSelectedClassroom={setSelectedClassroom}
      />
      {/* Table */}
      <DataTable
        title="Classroom List"
        headers={headers}
        data={classrooms || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={deletingClassroomId}
        actionButtons
        idKey="classroomId"
      />
    </Container>
  );
};
export default ClassroomPage;
