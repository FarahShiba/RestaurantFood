import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="text-center p-4 shadow-lg" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h1 className="display-4 mb-3">404</h1>
          <Card.Title className="mb-2">Page Not Found</Card.Title>
          <Card.Text className="text-muted">
            Oops! The page you are looking for does not exist.
          </Card.Text>
          <Link to="/" className="mt-3">
            <Button variant="primary" className="w-100">
              <i className="bi bi-house-door-fill"></i> Back to Home
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NotFound;
