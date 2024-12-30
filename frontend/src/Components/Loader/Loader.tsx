import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
