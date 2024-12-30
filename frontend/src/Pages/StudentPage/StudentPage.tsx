import React, { useState, useCallback } from "react";
import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import StudentForm from "../../Components/Student/StudentForm";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
} from "../../redux/api/studentApi";
import Loader from "../../Components/Loader/Loader";
import { toast } from "react-toastify";

const StudentPage: React.FC = () => {
  // State for the selected student and deleting state
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(
    null
  );

  // Fetch students data
  const { data: students, error, isLoading, isError } = useGetStudentsQuery();

  // Delete student mutation
  const [deleteStudent] = useDeleteStudentMutation();

  // DataTable column definitions
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

  // Set selected student for editing
  const handleEdit = useCallback((student: any) => {
    setSelectedStudent(student);
  }, []);

  // Handle student deletion
  const handleDelete = async (student: any) => {
    setDeletingStudentId(student.studentId);
    try {
      await deleteStudent(student.studentId).unwrap();
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Something went wrong! Try again.");
    } finally {
      setDeletingStudentId(null);
    }
  };

  // Render loader if data is being fetched
  if (isLoading) return <Loader />;

  // Render error message if fetching data fails
  if (isError) {
    toast.error("Failed to load students data.");
    console.error("Error fetching students:", error);
    return null;
  }

  return (
    <Container>
      {/* Form for adding or editing students */}
      <StudentForm
        student={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />

      {/* Table for listing students */}
      <DataTable
        title="Student List"
        headers={headers}
        data={students || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={deletingStudentId}
        actionButtons
      />
    </Container>
  );
};

export default StudentPage;
