import { Container } from "react-bootstrap";
import DataTable from "../../Components/DataTable/DataTable";
import SubjectForm from "../../Components/Subject/SubjectForm";

const SubjectPage = () => {
  return (
    <Container>
      {/* Form  */}
      <SubjectForm />
      {/* Table */}
      {/* <DataTable /> */}
    </Container>
  );
};
export default SubjectPage;
