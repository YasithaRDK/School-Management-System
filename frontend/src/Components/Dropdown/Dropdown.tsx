import { Form } from "react-bootstrap";

interface IDropdownProps {
  options: any[];
  valueKey: string;
  labelKey: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  valueKey,
  labelKey,
  value,
  onChange,
  placeholder = "Select an option",
  loading = false,
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Dropdown</Form.Label>
      <Form.Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {loading ? (
          <option value="" disabled>
            Loading...
          </option>
        ) : (
          options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>
          ))
        )}
      </Form.Select>
    </Form.Group>
  );
};

export default Dropdown;
