import { Card } from "react-bootstrap";

const BookCardSkeleton = () => (
  <Card className="h-100 border-0 shadow-sm">
    <div className="skeleton" style={{ height: 260 }} />
    <Card.Body className="d-flex flex-column gap-2">
      <div className="skeleton rounded-pill" style={{ width: 90, height: 20 }} />
      <div className="skeleton rounded" style={{ width: "85%", height: 18 }} />
      <div className="skeleton rounded" style={{ width: "55%", height: 14 }} />
      <div className="skeleton rounded" style={{ width: "65%", height: 14 }} />
      <div className="skeleton rounded mt-1" style={{ width: "40%", height: 22 }} />
      <div className="d-flex gap-2 mt-2">
        <div className="skeleton rounded flex-fill" style={{ height: 32 }} />
        <div className="skeleton rounded flex-fill" style={{ height: 32 }} />
      </div>
    </Card.Body>
  </Card>
);

export default BookCardSkeleton;
