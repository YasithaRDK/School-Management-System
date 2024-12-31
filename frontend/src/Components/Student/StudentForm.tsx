import { useEffect } from "react";
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
import { useFormik } from "formik";
import { studentValidationSchema } from "../../validationSchemas/studentValidation";

interface IProps {
  student: IStudent | null;
  setSelectedStudent: React.Dispatch<React.SetStateAction<IStudent | null>>;
}

const StudentForm: React.FC<IProps> = ({ student, setSelectedStudent }) => {
  // Fetch classrooms from API
  const {
    data: classrooms,
    isLoading: classroomsLoading,
    isError: classroomsError,
    error,
  } = useGetClassroomsQuery();

  // Mutations for creating and updating students
  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  // Formik initialization for handling form values and validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactPerson: "",
      contactNo: "",
      emailAddress: "",
      dateOfBirth: "",
      classroomId: "",
    },
    validationSchema: studentValidationSchema, // Form validation schema
    onSubmit: async (values) => {
      try {
        // Handle student update or create
        if (student) {
          await updateStudent({ id: student.studentId, data: values }).unwrap();
          toast.success("Student updated successfully!");
        } else {
          await createStudent(values).unwrap();
          toast.success("Student created successfully!");
        }
        resetForm();
      } catch (error) {
        toast.error("Something went wrong! Try again.");
        console.error("Failed to save student:", error);
      }
    },
  });

  // Populate the form with student data if editing an existing student
  useEffect(() => {
    if (student) {
      formik.setValues({
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

  // Reset the form to initial values
  const resetForm = () => {
    formik.resetForm(); // Reset formik values to initial state
    setSelectedStudent(null); // Clear selected student after submit
  };

  // Determine if the form has been modified
  const isFormModified =
    Object.values(formik.values).some((value) => value !== "") || student;

  // Show error message if classroom data fetching fails
  if (classroomsError) {
    toast.error("Failed to load classroom data.");
    console.error("Error fetching classrooms:", error);
    return null; // Return early if there's an error
  }

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">{student ? "Edit Student" : "Add Student"}</p>

      {/* Form component */}
      <Form onSubmit={formik.handleSubmit} className="form-cls">
        {/* Row 1 */}
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

        {/* Row 2 */}
        <Row>
          <Col md={6}>
            <FormInput
              label="Contact Person"
              type="text"
              placeholder="Jane Doe"
              name="contactPerson"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.contactPerson && !!formik.errors.contactPerson
              }
              errorMessage={formik.errors.contactPerson}
            />
          </Col>
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
        </Row>

        {/* Row 3 */}
        <Row>
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
          <Col md={6}>
            <FormInput
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.dateOfBirth && !!formik.errors.dateOfBirth
              }
              errorMessage={formik.errors.dateOfBirth}
            />
          </Col>
        </Row>

        {/* Row 4  */}
        <Row>
          <Col md={6}>
            <Dropdown
              options={classrooms || []}
              valueKey="classroomId"
              labelKey="classroomName"
              placeholder="Select Classroom"
              onChange={(value: string) =>
                formik.setFieldValue("classroomId", value)
              }
              value={formik.values.classroomId}
              loading={classroomsLoading}
              isInvalid={
                formik.touched.classroomId && !!formik.errors.classroomId
              }
              errorMessage={formik.errors.classroomId}
              label="Classroom"
            />
          </Col>
        </Row>

        {/* Action buttons - Save/Update and Clear */}
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
