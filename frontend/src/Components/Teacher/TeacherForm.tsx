import { Button, Col, Form, Row } from "react-bootstrap";

const TeacherForm = () => {
  return (
    <div className="border-container mt-5">
      <p className="title-text">Add Teacher</p>
      <Form className="form-cls">
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" placeholder="First name" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last name</Form.Label>
              <Form.Control type="text" placeholder="Last name" />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact number</Form.Label>
              <Form.Control type="text" placeholder="Contact number" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="text" placeholder="Email address" />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mb-3">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default TeacherForm;
