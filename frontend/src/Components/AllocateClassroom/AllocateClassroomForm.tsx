import { Col, Form, Row } from "react-bootstrap";
import Dropdown from "../Dropdown/Dropdown";
import { useGetClassroomsQuery } from "../../redux/api/classroomApi";
import { useGetTeachersQuery } from "../../redux/api/teacher.Api";
import { toast } from "react-toastify";
import { useCreateAllocateClassroomMutation } from "../../redux/api/allocateClassroomApi";
import { useFormik } from "formik";
import ActionButton from "../ActionButton/ActionButton";
import * as Yup from "yup";
import { IAllocateClassroomRequest } from "../../types/allocateClassroom.types";

interface IProps {
  setTeacherId: (teacherId: number | undefined) => void; // Function to set teacherId
  setClassrooms: React.Dispatch<React.SetStateAction<any[]>>;
  isLoadingClassrooms: boolean;
}

const AllocateClassroomForm: React.FC<IProps> = ({
  setTeacherId,
  setClassrooms,
  isLoadingClassrooms = false,
}) => {
  // Fetch teachers and classrooms from API
  const {
    data: teachers,
    isLoading: teachersLoading,
    isError: isTeachersError,
    error: teacherError,
  } = useGetTeachersQuery();
  const {
    data: classrooms,
    isLoading: classroomsLoading,
    isError: isClassroomsError,
    error: classroomError,
  } = useGetClassroomsQuery();

  // Mutations for creating and updating allocations
  const [allocateClassroom, { isLoading: creating }] =
    useCreateAllocateClassroomMutation();

  // Formik setup for form values and validation
  const formik = useFormik({
    initialValues: {
      teacherId: "",
      classroomId: "",
    },
    validationSchema: Yup.object({
      teacherId: Yup.string().required("Teacher is required"),
      classroomId: Yup.string().required("Classroom is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload: IAllocateClassroomRequest = {
          teacherId: parseInt(values.teacherId, 10),
          classroomId: parseInt(values.classroomId, 10),
        };

        await allocateClassroom(payload).unwrap();
        toast.success("Classroom allocated successfully!");
        formik.resetForm({ values: { classroomId: "" } });
      } catch (error) {
        handleAllocationError(error);
      }
    },
  });

  // Reset form and clear data
  const resetForm = () => {
    formik.resetForm({ values: { ...formik.values, classroomId: "" } });
    setClassrooms([]);
    setTeacherId(undefined);
  };

  // Handle errors if teacher data fetching fails
  if (isTeachersError) {
    toast.error("Failed to load teacher data.");
    console.error("Error fetching teachers:", teacherError);
    return null;
  }

  // Handle errors if classroom data fetching fails
  if (isClassroomsError) {
    toast.error("Failed to load classroom data.");
    console.error("Error fetching classrooms:", classroomError);
    return null;
  }

  // Handle allocation errors
  const handleAllocationError = (error: any) => {
    if (error && "status" in error && error.status === 409) {
      toast.error("Classroom is already allocated.");
    } else {
      toast.error("Something went wrong! Try again.");
      console.error("Failed to allocate classroom:", error);
    }
  };

  return (
    <div className="border-container mt-5">
      {/* Form title */}
      <p className="title-text">Allocate Classroom</p>

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
              disabled={isLoadingClassrooms || creating}
            />
          </Col>

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
              disabled={isLoadingClassrooms || creating}
            />
          </Col>
        </Row>

        {/* Action buttons - Save/Update and Clear */}
        <div className="mt-3 mb-3 d-flex gap-2">
          <ActionButton
            label="Allocate"
            onClick={() => {}}
            loading={creating}
            disabled={creating || isLoadingClassrooms}
            variant="primary"
            type="submit"
          />
          {Object.values(formik.values).some((value) => value !== "") && (
            <ActionButton
              label="Clear"
              onClick={resetForm}
              variant="secondary"
              disabled={creating || isLoadingClassrooms}
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default AllocateClassroomForm;
