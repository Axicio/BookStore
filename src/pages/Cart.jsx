import { Button, Row, Col, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";
import EmptyState from "../components/EmptyState.jsx";
import CheckoutSteps from "../components/CheckoutSteps.jsx";
import { useCart } from "../hooks/useCart.js";
import { useNotification } from "../hooks/useNotification.js";
import { formatPrice } from "../utils/formatPrice.js";

const Cart = () => {
  const { items, setQuantity, removeItem, restoreItem, clearCart } = useCart();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (bookId) => {
    const item = items.find((i) => i.id === bookId);
    if (!item) return;
    removeItem(bookId);
    notify(`Removed "${item.title}" from cart`, {
      variant: "secondary",
      action: { label: "Undo", onClick: () => restoreItem(item) },
    });
  };

  const handleClearCart = () => {
    const snapshot = items;
    clearCart();
    notify(`Cleared ${snapshot.length} item${snapshot.length !== 1 ? "s" : ""} from cart`, {
      variant: "secondary",
      action: { label: "Undo", onClick: () => snapshot.forEach((item) => restoreItem(item)) },
    });
  };

  if (!items.length) {
    return (
      <EmptyState
        icon="bi-cart-x"
        title="Your Cart is Empty"
        message="Looks like you haven't added any books yet."
        actionLabel="Browse Books"
      />
    );
  }

  return (
    <div>
      <CheckoutSteps current={0} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Your Cart</h1>
        <Button variant="outline-danger" size="sm" onClick={handleClearCart}>
          <i className="bi bi-trash3 me-1" />
          Clear Cart
        </Button>
      </div>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: "5rem" }}>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span className="text-muted">Items ({itemCount})</span>
                  <span>{formatPrice(subtotal)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">Free</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </ListGroup.Item>
              </ListGroup>
              <Button className="w-100" size="lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
                <i className="bi bi-arrow-right ms-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;
