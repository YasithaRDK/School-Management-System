import * as Yup from "yup";

// Validation schema for teacher form
export const teacherValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  contactNo: Yup.string()
    .matches(/^0\d{9}$/, "Contact number must be 10 digits and start with 0")
    .required("Contact number is required"),
  emailAddress: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
});
