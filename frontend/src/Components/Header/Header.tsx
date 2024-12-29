import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="dark" className="py-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Smashy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/students">
              Students
            </Nav.Link>
            <Nav.Link as={NavLink} to="/teachers">
              Teachers
            </Nav.Link>
            <Nav.Link as={NavLink} to="/classrooms">
              Classrooms
            </Nav.Link>
            <Nav.Link as={NavLink} to="/subjects">
              Subjects
            </Nav.Link>
            <Nav.Link as={NavLink} to="allocate-classrooms">
              Allocate classrooms
            </Nav.Link>
            <Nav.Link as={NavLink} to="allocate-subjects">
              Allocate subjects
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
