import { Form, Row } from "react-bootstrap";
import { IClassroom } from "../../types/classroom.types";
import {
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
} from "../../redux/api/classroomApi";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";
import * as Yup from "yup";

interface IProps {
  classroom: IClassroom | null;
  setSelectedClassroom: React.Dispatch<React.SetStateAction<IClassroom | null>>;
}

const ClassroomForm: React.FC<IProps> = ({
  classroom,
  setSelectedClassroom,
}) => {
  // Mutations for creating and updating classroom
  const [createClassroom, { isLoading: creating }] =
    useCreateClassroomMutation();
  const [updateClassroom, { isLoading: updating }] =
    useUpdateClassroomMutation();

  // Formik initialization for handling form values and validation
  const formik = useFormik({
    initialValues: {
      classroomName: "",
    },
    validationSchema: Yup.object({
      classroomName: Yup.string()
        .matches(
          /^(?:1[0-2]|[1-9])-[A-Za-z]{1}$/,
          "Classroom name must be a number (1-12), followed by a dash ('-'), and up to one alphabetic character"
        )
        .required("Classroom name is required"),
    }), // Form validation schema
    onSubmit: async (values) => {
      try {
        // Handle classroom update or create
        if (classroom) {
          await updateClassroom({
            id: classroom.classroomId,
            data: values,
          }).unwrap();
          toast.success("Classroom updated successfully!");
        } else {
          await createClassroom(values).unwrap();
          toast.success("Classroom created successfully!");
        }
        resetForm();
      } catch (error) {
        toast.error("Something went wrong! Try again.");
        console.error("Failed to save classroom:", error);
      }
    },
  });

  // Populate the form with classroom data if editing an existing classroom
  useEffect(() => {
    if (classroom) {
      formik.setValues({
        classroomName: classroom.classroomName || "",
      });
    } else {
      resetForm();
    }
  }, [classroom]);

  // Reset the form to initial values
  const resetForm = () => {
    formik.resetForm(); // Reset formik values to initial state
    setSelectedClassroom(null); // Clear selected classroom after submit
  };

  // Determine if the form has been modified
  const isFormModified =
    Object.values(formik.values).some((value) => value !== "") || classroom;

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">Add Classroom</p>

      {/* Form component */}
      <Form onSubmit={formik.handleSubmit} className="form-cls">
        <Row className="mt-3">
          <FormInput
            label="Classroom Name"
            type="text"
            placeholder="1-A"
            name="classroomName"
            value={formik.values.classroomName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.classroomName && !!formik.errors.classroomName
            }
            errorMessage={formik.errors.classroomName}
          />
        </Row>
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label={classroom ? "Update" : "Save"}
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
export default ClassroomForm;
