import { Col, Form, Row } from "react-bootstrap";
import { ITeacher } from "../../types/teacher.types";
import { useEffect } from "react";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "../../redux/api/teacher.Api";
import { toast } from "react-toastify";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";
import { useFormik } from "formik";
import { teacherValidationSchema } from "../../validationSchemas/teacherValidation";

interface IProps {
  teacher: ITeacher | null;
  setSelectedTeacher: React.Dispatch<React.SetStateAction<ITeacher | null>>;
}

const TeacherForm: React.FC<IProps> = ({ teacher, setSelectedTeacher }) => {
  // Mutations for creating and updating teacher
  const [createTeacher, { isLoading: creating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: updating }] = useUpdateTeacherMutation();

  // Formik initialization for handling form values and validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactNo: "",
      emailAddress: "",
    },
    validationSchema: teacherValidationSchema, // Form validation schema
    onSubmit: async (values) => {
      try {
        // Handle teacher update or create
        if (teacher) {
          await updateTeacher({
            id: teacher.teacherId,
            data: values,
          }).unwrap();
          toast.success("Teacher updated successfully!");
        } else {
          await createTeacher(values).unwrap();
          toast.success("Teacher created successfully!");
        }
        resetForm();
      } catch (error) {
        toast.error("Something went wrong! Try again.");
        console.error("Failed to save teacher:", error);
      }
    },
  });

  // Populate the form with teacher data if editing an existing teacher
  useEffect(() => {
    if (teacher) {
      formik.setValues({
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        contactNo: teacher.contactNo || "",
        emailAddress: teacher.emailAddress || "",
      });
    } else {
      resetForm();
    }
  }, [teacher]);

  // Reset the form to initial values
  const resetForm = () => {
    formik.resetForm(); // Reset formik values to initial state
    setSelectedTeacher(null); // Clear selected teacher after submit
  };

  // Determine if the form has been modified
  const isFormModified =
    Object.values(formik.values).some((value) => value !== "") || teacher;

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">Add Teacher</p>

      {/* Form component */}
      <Form onSubmit={formik.handleSubmit} className="form-cls">
        <Row className="mt-3">
          <Col md={6}>
            <FormInput
              label="First Name"
              type="text"
              placeholder="John"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.firstName && !!formik.errors.firstName}
              errorMessage={formik.errors.firstName}
            />
          </Col>
          <Col md={6}>
            <FormInput
              label="Last Name"
              type="text"
              placeholder="Doe"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.lastName && !!formik.errors.lastName}
              errorMessage={formik.errors.lastName}
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
              value={formik.values.contactNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.contactNo && !!formik.errors.contactNo}
              errorMessage={formik.errors.contactNo}
            />
          </Col>
          <Col md={6}>
            <FormInput
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              name="emailAddress"
              value={formik.values.emailAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.emailAddress && !!formik.errors.emailAddress
              }
              errorMessage={formik.errors.emailAddress}
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
