import { Col, Form, Row } from "react-bootstrap";
import Dropdown from "../Dropdown/Dropdown";
import { useGetSubjectsQuery } from "../../redux/api/subjectApi";
import { useGetTeachersQuery } from "../../redux/api/teacher.Api";
import { toast } from "react-toastify";
import { useCreateAllocateSubjectMutation } from "../../redux/api/allocateSubjectApi";
import { useFormik } from "formik";
import ActionButton from "../ActionButton/ActionButton";
import * as Yup from "yup";
import { IAllocateSubjectRequest } from "../../types/allocateSubject.types";

interface IProps {
  setTeacherId: (teacherId: number | undefined) => void; // Function to set teacherId
  setSubjects: React.Dispatch<React.SetStateAction<any[]>>;
  isLoadingSubjects: boolean;
}

const AllocateSubjectForm: React.FC<IProps> = ({
  setTeacherId,
  setSubjects,
  isLoadingSubjects = false,
}) => {
  // Fetch teachers and subjects from API
  const {
    data: teachers,
    isLoading: teachersLoading,
    isError: isTeachersError,
    error: teacherError,
  } = useGetTeachersQuery();
  const {
    data: subjects,
    isLoading: subjectsLoading,
    isError: isSubjectsError,
    error: subjectError,
  } = useGetSubjectsQuery();

  // Mutations for creating and updating allocations
  const [allocateSubject, { isLoading: creating }] =
    useCreateAllocateSubjectMutation();

  // Formik setup for form values and validation
  const formik = useFormik({
    initialValues: {
      teacherId: "",
      subjectId: "",
    },
    validationSchema: Yup.object({
      teacherId: Yup.string().required("Teacher is required"),
      subjectId: Yup.string().required("Subject is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload: IAllocateSubjectRequest = {
          teacherId: parseInt(values.teacherId, 10),
          subjectId: parseInt(values.subjectId, 10),
        };

        await allocateSubject(payload).unwrap();
        toast.success("Subject allocated successfully!");
        formik.resetForm({ values: { subjectId: "" } });
      } catch (error) {
        handleAllocationError(error);
      }
    },
  });

  // Reset form and clear data
  const resetForm = () => {
    formik.resetForm({ values: { ...formik.values, subjectId: "" } });
    setSubjects([]);
    setTeacherId(undefined);
  };

  // Handle errors if teacher data fetching fails
  if (isTeachersError) {
    toast.error("Failed to load teacher data.");
    console.error("Error fetching teachers:", teacherError);
    return null;
  }

  // Handle errors if subject data fetching fails
  if (isSubjectsError) {
    toast.error("Failed to load subject data.");
    console.error("Error fetching subjects:", subjectError);
    return null;
  }

  // Handle allocation errors
  const handleAllocationError = (error: any) => {
    if (error && "status" in error && error.status === 409) {
      toast.error("Subject is already allocated.");
    } else {
      toast.error("Something went wrong! Try again.");
      console.error("Failed to allocate subject:", error);
    }
  };

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">Allocate Subject</p>

      <Form onSubmit={formik.handleSubmit}>
        <Row className="mt-3">
          <Col md={6}>
            <Dropdown
              options={teachers || []}
              valueKey="teacherId"
              labelKey={(teacher: any) =>
                `${teacher.firstName} ${teacher.lastName}`
              }
              placeholder="Select Teacher"
              onChange={(value: string) => {
                formik.setFieldValue("teacherId", value);
                setTeacherId(parseInt(value, 10));
              }}
              value={formik.values.teacherId}
              loading={teachersLoading}
              isInvalid={formik.touched.teacherId && !!formik.errors.teacherId}
              errorMessage={formik.errors.teacherId}
              label="Teacher"
              disabled={isLoadingSubjects || creating}
            />
          </Col>

          <Col md={6}>
            <Dropdown
              options={subjects || []}
              valueKey="subjectId"
              labelKey="subjectName"
              placeholder="Select Subject"
              onChange={(value: string) =>
                formik.setFieldValue("subjectId", value)
              }
              value={formik.values.subjectId}
              loading={subjectsLoading}
              isInvalid={formik.touched.subjectId && !!formik.errors.subjectId}
              errorMessage={formik.errors.subjectId}
              label="Subject"
              disabled={isLoadingSubjects || creating}
            />
          </Col>
        </Row>

        {/* Action buttons - Save/Update and Clear */}
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label="Allocate"
            onClick={() => {}}
            loading={creating}
            disabled={creating || isLoadingSubjects}
            variant="primary"
            type="submit"
          />
          {Object.values(formik.values).some((value) => value !== "") && (
            <ActionButton
              label="Clear"
              onClick={resetForm}
              variant="secondary"
              disabled={creating || isLoadingSubjects}
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default AllocateSubjectForm;
