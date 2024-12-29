import { Button, Form, Row } from "react-bootstrap";

const SubjectForm = () => {
  return (
    <div className="border-container mt-5">
      <p className="title-text">Add Subject</p>
      <Form className="form-cls">
        <Row className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Subject name</Form.Label>
            <Form.Control type="text" placeholder="Classroom name" />
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit" className="mb-3">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default SubjectForm;
