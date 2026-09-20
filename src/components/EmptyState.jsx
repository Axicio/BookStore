import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const EmptyState = ({ icon, title, message, actionLabel, actionTo = "/" }) => (
  <div className="text-center py-5">
    <div
      className="mx-auto mb-3 rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
      style={{ width: 120, height: 120 }}
    >
      <i className={`bi ${icon} display-4 text-primary`} />
    </div>
    <h1 className="h3">{title}</h1>
    <p className="text-muted mb-4">{message}</p>
    {actionLabel && (
      <Button as={Link} to={actionTo} size="lg">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
