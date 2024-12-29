import React from "react";
import { Form } from "react-bootstrap";

interface IDropdownProps {
  options: any[];
  valueKey: string;
  labelKey: string;
  value: string | null; // Selected value
  onChange: (value: string) => void; // Change handler
  placeholder?: string;
}

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  valueKey,
  labelKey,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Dropdown</Form.Label>
      <Form.Select
        value={value || ""} // Bind the selected value
        onChange={(e) => onChange(e.target.value)} // Handle value changes
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default Dropdown;
