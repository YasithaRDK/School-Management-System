import { Container } from "react-bootstrap";
import AllocateSubjectForm from "../../Components/AllocateSubject/AllocateSubjectForm";
import DataTable from "../../Components/DataTable/DataTable";
import Loader from "../../Components/Loader/Loader";
import {
  useDeleteAllocateSubjectMutation,
  useGetAllocateSubjectsByTeacherIdQuery,
} from "../../redux/api/allocateSubjectApi";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";

const AllocateSubjectPage = () => {
  // State for teacher selection and subjects
  const [teacherId, setTeacherId] = useState<number | undefined>(undefined);
  const [deletingSubjectId, setDeletingSubjectId] = useState<number | null>(
    null
  );
  const [subjects, setSubjects] = useState<any[]>([]);

  // API Hooks
  const {
    data: allocatedSubjects,
    isLoading: isLoadingSubjects,
    isError: isSubjectsError,
    error: subjectsError,
  } = useGetAllocateSubjectsByTeacherIdQuery(teacherId as number, {
    skip: teacherId === undefined,
  });

  const [deleteAllocateSubject] = useDeleteAllocateSubjectMutation();

  const headers = [{ key: "subjectName", label: "Subject" }];

  useEffect(() => {
    if (teacherId === undefined || !allocatedSubjects) {
      setSubjects([]); // Clear subjects when no teacher is selected
    } else {
      setSubjects(allocatedSubjects.subjects || []);
    }
  }, [teacherId, allocatedSubjects]);

  const handleDelete = useCallback(
    async (subjectId: number) => {
      if (!teacherId) return;

      setDeletingSubjectId(subjectId);
      try {
        await deleteAllocateSubject({ teacherId, subjectId }).unwrap();
        toast.success("Subject unallocated successfully!");
      } catch (error) {
        console.error("Failed to deallocate subject:", error);
        toast.error("Something went wrong! Try again.");
      } finally {
        setDeletingSubjectId(null);
      }
    },
    [teacherId, deleteAllocateSubject]
  );

  // Handle errors in allocated subjects fetching
  useEffect(() => {
    if (isSubjectsError) {
      console.error("Error fetching allocated subjects:", subjectsError);
      setSubjects([]);
    }
  }, [isSubjectsError, subjectsError]);

  return (
    <Container>
      <AllocateSubjectForm
        setTeacherId={setTeacherId}
        isLoadingSubjects={isLoadingSubjects}
        setSubjects={setSubjects}
      />
      {isLoadingSubjects ? (
        <Loader height={50} />
      ) : (
        <DataTable
          title="Subject List"
          headers={headers}
          data={subjects}
          onEdit={() => {}}
          onDelete={(subject) => handleDelete(subject.subjectId)}
          loading={deletingSubjectId}
          idKey="subjectId"
        />
      )}
    </Container>
  );
};

export default AllocateSubjectPage;
