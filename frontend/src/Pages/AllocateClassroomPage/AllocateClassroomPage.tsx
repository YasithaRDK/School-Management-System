import { Container } from "react-bootstrap";
import AllocateClassroomForm from "../../Components/AllocateClassroom/AllocateClassroomForm";
import DataTable from "../../Components/DataTable/DataTable";
import Loader from "../../Components/Loader/Loader";
import {
  useDeleteAllocateClassroomMutation,
  useGetAllocateClassroomsByTeacherIdQuery,
} from "../../redux/api/allocateClassroomApi";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";

const AllocateClassroomPage = () => {
  // State for teacher selection and classrooms
  const [teacherId, setTeacherId] = useState<number | undefined>(undefined);
  const [deletingClassroomId, setDeletingClassroomId] = useState<number | null>(
    null
  );
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // API Hooks
  const {
    data: allocatedClassrooms,
    isLoading: isLoadingClassrooms,
    isError: isClassroomsError,
    error: classroomsError,
  } = useGetAllocateClassroomsByTeacherIdQuery(teacherId as number, {
    skip: teacherId === undefined,
  });

  const [deleteAllocateClassroom] = useDeleteAllocateClassroomMutation();

  const headers = [{ key: "classroomName", label: "Classroom" }];

  useEffect(() => {
    if (teacherId === undefined || !allocatedClassrooms) {
      setClassrooms([]); // Clear classrooms when no teacher is selected
    } else {
      setClassrooms(allocatedClassrooms.classrooms || []);
    }
  }, [teacherId, allocatedClassrooms]);

  const handleDelete = useCallback(
    async (classroomId: number) => {
      if (!teacherId) return;

      setDeletingClassroomId(classroomId);
      try {
        await deleteAllocateClassroom({ teacherId, classroomId }).unwrap();
        toast.success("Classroom unallocated successfully!");
      } catch (error) {
        console.error("Failed to deallocate classroom:", error);
        toast.error("Something went wrong! Try again.");
      } finally {
        setDeletingClassroomId(null);
      }
    },
    [teacherId, deleteAllocateClassroom]
  );

  // Handle errors in allocated classrooms fetching
  useEffect(() => {
    if (isClassroomsError) {
      console.error("Error fetching allocated classrooms:", classroomsError);
      setClassrooms([]);
    }
  }, [isClassroomsError, classroomsError]);

  return (
    <Container>
      <AllocateClassroomForm
        setTeacherId={setTeacherId}
        isLoadingClassrooms={isLoadingClassrooms}
        setClassrooms={setClassrooms}
      />
      {isLoadingClassrooms ? (
        <Loader height={50} />
      ) : (
        <DataTable
          title="Classroom List"
          headers={headers}
          data={classrooms}
          onEdit={() => {}}
          onDelete={(classroom) => handleDelete(classroom.classroomId)}
          loading={deletingClassroomId}
          idKey="classroomId"
        />
      )}
    </Container>
  );
};

export default AllocateClassroomPage;
