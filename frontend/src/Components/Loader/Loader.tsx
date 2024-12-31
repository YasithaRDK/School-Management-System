import { Spinner } from "react-bootstrap";

interface IProps {
  height?: number;
}

const Loader: React.FC<IProps> = ({ height = 100 }) => {
  return (
    <div
      style={{ height: `${height}vh` }}
      className="d-flex justify-content-center align-items-center"
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
