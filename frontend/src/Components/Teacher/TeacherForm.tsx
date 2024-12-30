import { Col, Form, Row } from "react-bootstrap";
import { ITeacher } from "../../types/teacher.types";
import { useEffect, useState } from "react";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "../../redux/api/teacher.Api";
import { toast } from "react-toastify";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";

interface IProps {
  teacher: ITeacher | null;
  setSelectedTeacher: React.Dispatch<React.SetStateAction<ITeacher | null>>;
}

const TeacherForm: React.FC<IProps> = ({ teacher, setSelectedTeacher }) => {
  const [formData, setFormData] = useState<Partial<ITeacher>>({
    firstName: "",
    lastName: "",
    contactNo: "",
    emailAddress: "",
  });

  const [createTeacher, { isLoading: creating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: updating }] = useUpdateTeacherMutation();

  // Populate form data when a teacher is selected for editing
  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        contactNo: teacher.contactNo || "",
        emailAddress: teacher.emailAddress || "",
      });
    } else {
      resetForm();
    }
  }, [teacher]);

  // Update form data on input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (create or update teacher)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value)) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      if (teacher) {
        await updateTeacher({ id: teacher.teacherId, data: formData }).unwrap();
        toast.success("Teacher updated successfully!");
      } else {
        await createTeacher(formData).unwrap();
        toast.success("Teacher created successfully!");
      }
      resetForm();
    } catch (error) {
      toast.error("Something went wrong! Try again.");
      console.error("Failed to save teacher:", error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      contactNo: "",
      emailAddress: "",
    });
    setSelectedTeacher(null);
  };

  const isFormModified =
    Object.values(formData).some((value) => value !== "") || teacher;

  return (
    <div className="border-container mt-5">
      <p className="title-text">Add Teacher</p>
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
              label="Contact Number"
              type="text"
              placeholder="0712345678"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
            />
          </Col>
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
        </Row>
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label={teacher ? "Update" : "Save"}
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
export default TeacherForm;
