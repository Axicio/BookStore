import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <div
        className="mx-auto mb-3 rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
        style={{ width: 120, height: 120 }}
      >
        <i className="bi bi-compass display-4 text-primary" />
      </div>
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button as={Link} to="/" size="lg">
        <i className="bi bi-house-door me-2" />
        Go back home
      </Button>
    </div>
  );
};

export default NotFound;
