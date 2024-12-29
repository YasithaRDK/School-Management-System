import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import ClassroomForm from "../../Components/Classroom/ClassroomForm";

const ClassroomPage = () => {
  return (
    <Container>
      {/* Form  */}
      <ClassroomForm />
      {/* Table */}
      {/* <DataTable /> */}
    </Container>
  );
};
export default ClassroomPage;
