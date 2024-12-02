// Header.jsx
import { Nav, Container, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header({ user, onLogout }) {
  return (
    <Navbar bg="white" expand="lg" className="header shadow-sm p-3">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="text-decoration-none">
            <div className="d-flex align-items-center">
              <div className="logo-circle me-2"></div>
              <h3 className="display-8 text-dark-brown m-0">Restaurant Food</h3>
            </div>
          </Link>
        </Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          <Link to="/" className="nav-link me-2">
            Restaurants
          </Link>
          <Link to="/restaurant/list" className="nav-link me-2">
            Restaurant List
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                {user.username}
              </Link>
              <Button variant="outline-dark" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
