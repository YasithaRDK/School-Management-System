import * as Yup from "yup";

// Validation schema for student form
export const studentValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  contactPerson: Yup.string().required("Contact person is required"),
  contactNo: Yup.string()
    .matches(/^0\d{9}$/, "Contact number must be 10 digits and start with 0")
    .required("Contact number is required"),
  emailAddress: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  classroomId: Yup.string().required("Classroom is required"),
});
