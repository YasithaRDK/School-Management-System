import { Form } from "react-bootstrap";

// Updated interface with disabled prop
interface IDropdownProps {
  options: any[];
  valueKey: string;
  labelKey: string | ((option: any) => string);
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  label: string;
  disabled?: boolean; // Added disabled prop
}

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  valueKey,
  labelKey,
  value,
  onChange,
  placeholder = "Select an option",
  loading = false,
  errorMessage,
  isInvalid = false,
  label,
  disabled = false, // Default to false if not provided
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      <Form.Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={isInvalid}
        disabled={disabled || loading} // Disable if either disabled prop is true or loading is true
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {loading ? (
          <option value="" disabled>
            Loading...
          </option>
        ) : (
          options.map((option) => {
            const label =
              typeof labelKey === "function"
                ? labelKey(option)
                : option[labelKey];

            return (
              <option key={option[valueKey]} value={option[valueKey]}>
                {label}
              </option>
            );
          })
        )}
      </Form.Select>

      {isInvalid && errorMessage && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Dropdown;
