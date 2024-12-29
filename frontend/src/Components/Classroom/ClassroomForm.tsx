import { Button, Form, Row } from "react-bootstrap";

const ClassroomForm = () => {
  return (
    <div className="border-container mt-5">
      <p className="title-text">Add Classroom</p>
      <Form className="form-cls">
        <Row className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Classroom name</Form.Label>
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
export default ClassroomForm;
