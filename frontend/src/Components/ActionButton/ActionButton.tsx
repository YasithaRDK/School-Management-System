import React from "react";
import { Button } from "react-bootstrap";

interface ActionButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  type = "button",
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={loading || disabled}
      type={type}
    >
      {loading ? "processing..." : label}
    </Button>
  );
};

export default ActionButton;
