import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import SubjectForm from "../../Components/Subject/SubjectForm";
import { useCallback, useState } from "react";
import {
  useDeleteSubjectMutation,
  useGetSubjectsQuery,
} from "../../redux/api/subjectApi";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";

const SubjectPage = () => {
  // State for the selected subject and deleting state
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<number | null>(
    null
  );

  // Fetch subjects data
  const { data: subjects, error, isLoading, isError } = useGetSubjectsQuery();

  // Delete subject mutation
  const [deleteSubject] = useDeleteSubjectMutation();

  // DataTable column definitions
  const headers = [{ key: "subjectName", label: "Subject Name" }];

  // Set selected subject for editing
  const handleEdit = useCallback((subject: any) => {
    setSelectedSubject(subject);
  }, []);

  // Handle subject deletion
  const handleDelete = async (subject: any) => {
    setDeletingSubjectId(subject.subjectId);
    try {
      await deleteSubject(subject.subjectId).unwrap();
      toast.success("Subject deleted successfully!");
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast.error("Something went wrong! Try again.");
    } finally {
      setDeletingSubjectId(null);
    }
  };

  // Render loader if data is being fetched
  if (isLoading) return <Loader />;

  // Render error message if fetching data fails
  if (isError) {
    toast.error("Failed to load subjects data.");
    console.error("Error fetching subjects:", error);
    return null;
  }

  return (
    <Container>
      {/* Form  */}
      <SubjectForm
        subject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
      {/* Table */}
      <DataTable
        title="Subject List"
        headers={headers}
        data={subjects || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={deletingSubjectId}
        actionButtons
        idKey="subjectId"
      />
    </Container>
  );
};
export default SubjectPage;
