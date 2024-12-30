import { Form } from "react-bootstrap";

// Define the props for the Dropdown component
interface IDropdownProps {
  options: any[]; // List of options to display
  valueKey: string; // Key for the value in each option
  labelKey: string; // Key for the label in each option
  value: string | undefined; // Current selected value
  onChange: (value: string) => void; // Callback function when an option is selected
  placeholder?: string; // Placeholder text when no option is selected
  loading?: boolean; // Whether data is being loaded
  errorMessage?: string; // Error message if any validation fails
  isInvalid?: boolean; // Whether the input is invalid
}

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  valueKey,
  labelKey,
  value,
  onChange,
  placeholder = "Select an option", // Default placeholder if none provided
  loading = false, // Default loading state to false
  errorMessage,
  isInvalid = false, // Default to false if no invalid state is provided
}) => {
  return (
    <Form.Group className="mb-3">
      {/* Label for dropdown */}
      <Form.Label>Dropdown</Form.Label>

      {/* Dropdown select */}
      <Form.Select
        value={value || ""} // Ensure controlled value (fallback to empty string)
        onChange={(e) => onChange(e.target.value)} // Trigger parent onChange
        isInvalid={isInvalid} // Apply invalid styling if there is an error
      >
        {/* Placeholder option */}
        <option value="">{placeholder}</option>

        {/* Show loading option if loading is true */}
        {loading ? (
          <option value="" disabled>
            Loading...
          </option>
        ) : (
          // Map through options and display them
          options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>
          ))
        )}
      </Form.Select>

      {/* Error message feedback */}
      {isInvalid && errorMessage && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Dropdown;
