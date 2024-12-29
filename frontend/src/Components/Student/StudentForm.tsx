import { Button, Col, Form, Row } from "react-bootstrap";
import "./StudentForm.scss";
import Dropdown from "../Dropdown/Dropdown";
import { useGetClassroomsQuery } from "../../redux/api/classroomApi";
import { useState } from "react";
import { useCreateStudentMutation } from "../../redux/api/studentApi";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactPerson: "",
    contactNo: "",
    emailAddress: "",
    dateOfBirth: "",
    classroomId: "",
  });

  const {
    data: classrooms = [],
    isLoading,
    isError,
    error,
  } = useGetClassroomsQuery();
  const [createStudent, { isLoading: createStudentLoading }] =
    useCreateStudentMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      classroomId: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      contactPerson,
      contactNo,
      emailAddress,
      dateOfBirth,
      classroomId,
    } = formData;
    if (
      !firstName ||
      !lastName ||
      !contactPerson ||
      !contactNo ||
      !emailAddress ||
      !dateOfBirth ||
      !classroomId
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await createStudent(formData).unwrap();
      setFormData({
        firstName: "",
        lastName: "",
        contactPerson: "",
        contactNo: "",
        emailAddress: "",
        dateOfBirth: "",
        classroomId: "",
      });
      alert("Student created successfully!");
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to create student.");
    }
  };

  if (isLoading) return <p>Loading classrooms...</p>;
  if (isError) console.log(error);

  return (
    <div className="border-container mt-5">
      <p className="title-text">Add Student</p>
      <Form onSubmit={handleSubmit} className="form-cls">
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact person</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contact person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contact number"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Date of birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown
              options={classrooms}
              valueKey="classroomId"
              labelKey="classroomName"
              placeholder="Select Classroom"
              onChange={handleDropdownChange}
              value={formData.classroomId}
            />
          </Col>
        </Row>
        <Button
          variant="primary"
          type="submit"
          className="mb-3"
          disabled={createStudentLoading}
        >
          {createStudentLoading ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </div>
  );
};

export default StudentForm;
