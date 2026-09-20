import { useEffect, useState } from "react";
import { Card, ListGroup, Badge, Spinner, Alert } from "react-bootstrap";
import { getOrders } from "../api/orders.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatPrice } from "../utils/formatPrice.js";
import EmptyState from "../components/EmptyState.jsx";

const STATUS_VARIANTS = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders(user.id)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!orders.length) {
    return (
      <EmptyState
        icon="bi-receipt"
        title="No Orders Yet"
        message="Your past orders will show up here once you place one."
        actionLabel="Browse Books"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-4">My Orders</h1>
      <div className="d-flex flex-column gap-3">
        {orders.map((order) => (
          <Card key={order.id} className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <div className="fw-semibold">Order #{order.id.slice(0, 8)}</div>
                  <div className="text-muted small">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <Badge bg={STATUS_VARIANTS[order.status] ?? "secondary"} className="text-capitalize">
                  {order.status}
                </Badge>
              </div>
              <ListGroup variant="flush">
                {order.items.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between px-0">
                    <span className="text-muted">
                      {item.title} &times; {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </ListGroup.Item>
                ))}
                {order.discount && (
                  <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                    <span>
                      Promo <span className="fw-semibold">{order.discount.code}</span>
                    </span>
                    <span>-{formatPrice(order.discount.amount)}</span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
