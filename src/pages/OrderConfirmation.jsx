import { Navigate, Link, useLocation } from "react-router-dom";
import { ListGroup, Button, Card } from "react-bootstrap";
import { formatPrice } from "../utils/formatPrice.js";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import ConfettiBurst from "../components/ConfettiBurst.jsx";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ maxWidth: 600 }} className="mx-auto py-3">
      <div className="no-print">
        <ConfettiBurst />
        <CheckoutSteps current={3} />
      </div>
      <div className="text-center mb-4">
        <i className="bi bi-check-circle-fill display-3 text-success" />
        <h1 className="h3 mt-3 mb-1">Order Confirmed!</h1>
        <p className="text-muted">
          Order <strong>#{order.id}</strong> has been placed successfully.
        </p>
      </div>

      <Card className="receipt-card border-0 shadow-sm mb-4 overflow-hidden">
        <div className="receipt-scallop receipt-scallop-top" />
        <Card.Body className="p-4">
          <dl className="row mb-0">
            <dt className="col-sm-4">Name</dt>
            <dd className="col-sm-8">{order.fullName}</dd>
            <dt className="col-sm-4">Shipping Address</dt>
            <dd className="col-sm-8 mb-0" style={{ whiteSpace: "pre-wrap" }}>
              {order.address}
            </dd>
          </dl>
        </Card.Body>

        <hr className="receipt-divider" />

        <Card.Body className="p-4">
          <ListGroup variant="flush">
            {order.items.map((item) => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between px-0 bg-transparent">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </ListGroup.Item>
            ))}
            {order.discount && (
              <ListGroup.Item className="d-flex justify-content-between px-0 text-success bg-transparent">
                <span>
                  Promo <span className="fw-semibold">{order.discount.code}</span>
                </span>
                <span>-{formatPrice(order.discount.amount)}</span>
              </ListGroup.Item>
            )}
            <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5 bg-transparent">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <div className="receipt-scallop receipt-scallop-bottom" />
      </Card>

      <div className="text-center d-flex gap-2 justify-content-center flex-wrap no-print">
        <Button as={Link} to="/" size="lg">
          Continue Shopping
        </Button>
        <Button variant="outline-secondary" size="lg" onClick={() => window.print()}>
          <i className="bi bi-printer me-2" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
