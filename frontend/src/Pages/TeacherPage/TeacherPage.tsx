import { Container } from "react-bootstrap";
import TeacherForm from "../../Components/Teacher/TeacherForm";
import DataTable from "../../Components/DataTable/DataTable";

const TeacherPage = () => {
  return (
    <Container>
      {/* Form  */}
      <TeacherForm />
      {/* Table */}
      {/* <DataTable /> */}
    </Container>
  );
};
export default TeacherPage;
