import { Form } from "react-bootstrap";

// Define the props for the FormInput component
interface IProps {
  label: string;
  type: string;
  placeholder?: string;
  name: string;
  value: string | undefined;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  errorMessage?: string;
  isInvalid?: boolean;
}

// Functional component for form input fields
const FormInput: React.FC<IProps> = ({
  label,
  type,
  placeholder = "",
  name,
  value,
  onChange,
  onBlur,
  errorMessage,
  isInvalid = false,
}) => {
  return (
    <Form.Group className="mb-3">
      {/* Label for the input field */}
      <Form.Label>{label}</Form.Label>

      {/* Input field */}
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        isInvalid={isInvalid} // Set the invalid state based on Formik error
      />

      {/* Error message display */}
      {isInvalid && errorMessage && (
        <Form.Control.Feedback type="invalid">
          {errorMessage} {/* Show the error message if the input is invalid */}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormInput;
