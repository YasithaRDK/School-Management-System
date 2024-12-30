import { Form, Row } from "react-bootstrap";
import { ISubject } from "../../types/subject.types";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "../../redux/api/subjectApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";

interface IProps {
  subject: ISubject | null;
  setSelectedSubject: React.Dispatch<React.SetStateAction<ISubject | null>>;
}

const SubjectForm: React.FC<IProps> = ({ subject, setSelectedSubject }) => {
  // Mutations for creating and updating subject
  const [createSubject, { isLoading: creating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: updating }] = useUpdateSubjectMutation();

  // Formik initialization for handling form values and validation
  const formik = useFormik({
    initialValues: {
      subjectName: "",
    },
    validationSchema: Yup.object({
      subjectName: Yup.string().required("Subject name is required"),
    }), // Form validation schema
    onSubmit: async (values) => {
      try {
        // Handle subject update or create
        if (subject) {
          await updateSubject({
            id: subject.subjectId,
            data: values,
          }).unwrap();
          toast.success("Subject updated successfully!");
        } else {
          await createSubject(values).unwrap();
          toast.success("Subject created successfully!");
        }
        resetForm();
      } catch (error) {
        toast.error("Something went wrong! Try again.");
        console.error("Failed to save subject:", error);
      }
    },
  });

  // Populate the form with subject data if editing an existing subject
  useEffect(() => {
    if (subject) {
      formik.setValues({
        subjectName: subject.subjectName || "",
      });
    } else {
      resetForm();
    }
  }, [subject]);

  // Reset the form to initial values
  const resetForm = () => {
    formik.resetForm(); // Reset formik values to initial state
    setSelectedSubject(null); // Clear selected subject after submit
  };

  // Determine if the form has been modified
  const isFormModified =
    Object.values(formik.values).some((value) => value !== "") || subject;

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">Add Subject</p>

      {/* Form component */}
      <Form onSubmit={formik.handleSubmit} className="form-cls">
        <Row className="mt-3">
          <FormInput
            label="Subject Name"
            type="text"
            placeholder="Ex:- Maths"
            name="subjectName"
            value={formik.values.subjectName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.subjectName && !!formik.errors.subjectName
            }
            errorMessage={formik.errors.subjectName}
          />
        </Row>
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label={subject ? "Update" : "Save"}
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
export default SubjectForm;
