import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./StudentForm.scss";
import Dropdown from "../Dropdown/Dropdown";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "../../redux/api/studentApi";
import { useGetClassroomsQuery } from "../../redux/api/classroomApi";
import { toast } from "react-toastify";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";
import { IStudent } from "../../types/student.types";

interface IProps {
  student: IStudent | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<IStudent | null>>;
}

const StudentForm: React.FC<IProps> = ({ student, setSelectedStudent }) => {
  const [formData, setFormData] = useState<Partial<IStudent>>({
    firstName: "",
    lastName: "",
    contactPerson: "",
    contactNo: "",
    emailAddress: "",
    dateOfBirth: "",
    classroomId: "",
  });

  const {
    data: classrooms,
    isLoading: classroomsLoading,
    isError: classroomsError,
    error,
  } = useGetClassroomsQuery();

  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  // Populate form data when a student is selected for editing
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        contactPerson: student.contactPerson || "",
        contactNo: student.contactNo || "",
        emailAddress: student.emailAddress || "",
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split("T")[0]
          : "",
        classroomId: student.classroomId || "",
      });
    } else {
      resetForm();
    }
  }, [student]);

  // Update form data on input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update classroom selection
  const handleDropdownChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classroomId: value }));
  };

  // Handle form submission (create or update student)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      if (student) {
        await updateStudent({ id: student.studentId, data: formData }).unwrap();
        toast.success("Student updated successfully!");
      } else {
        await createStudent(formData).unwrap();
        toast.success("Student created successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error("Something went wrong! Try again.");
      console.error("Failed to save student:", error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      contactPerson: "",
      contactNo: "",
      emailAddress: "",
      dateOfBirth: "",
      classroomId: "",
    });
    setSelectedStudent(null);
  };

  const isFormModified =
    Object.values(formData).some((value) => value !== "") || student;

  // Render error message if fetching data fails
  if (classroomsError) {
    toast.error("Failed to load classroom data.");
    console.error("Error fetching students:", error);
    return null;
  }

  return (
    <div className="border-container mt-5">
      <p className="title-text">{student ? "Edit Student" : "Add Student"}</p>
      <Form onSubmit={handleSubmit} className="form-cls">
        <Row className="mt-3">
          <Col md={6}>
            <FormInput
              label="First Name"
              type="text"
              placeholder="John"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <FormInput
              label="Last Name"
              type="text"
              placeholder="Doe"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormInput
              label="Contact Person"
              type="text"
              placeholder="Jane Doe"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <FormInput
              label="Contact Number"
              type="text"
              placeholder="0712345678"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormInput
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
            />
          </Col>
          <Col md={6}>
            <FormInput
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Dropdown
              options={classrooms || []}
              valueKey="classroomId"
              labelKey="classroomName"
              placeholder="Select Classroom"
              onChange={handleDropdownChange}
              value={formData.classroomId}
              loading={classroomsLoading}
            />
          </Col>
        </Row>
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label={student ? "Update" : "Save"}
            onClick={() => {}}
            loading={creating || updating}
            disabled={creating || updating}
            variant="primary"
            type="submit"
          />
          {isFormModified && (
            <ActionButton
              label="Clear"
              onClick={resetForm}
              variant="secondary"
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default StudentForm;
