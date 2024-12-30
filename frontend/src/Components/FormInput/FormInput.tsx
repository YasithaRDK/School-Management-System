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
}

// Functional component for form input fields
const FormInput: React.FC<IProps> = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
};

export default FormInput;
