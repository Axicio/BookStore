import { useState } from "react";
import { Form, Button, Alert, Card, Row, Col, ListGroup, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { useNotification } from "../hooks/useNotification.js";
import { createOrder } from "../api/orders.js";
import { formatPrice } from "../utils/formatPrice.js";
import { getDiscount } from "../utils/promoCodes.js";
import CheckoutSteps from "../components/CheckoutSteps.jsx";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - (discount?.amount ?? 0);

  const handleApplyPromo = () => {
    const result = getDiscount(promoInput, subtotal);
    if (!result) {
      setPromoError("Invalid or expired promo code.");
      setDiscount(null);
      return;
    }
    setPromoError(null);
    setDiscount(result);
    notify(`Promo code ${result.code} applied — ${result.label}`);
  };

  const handleRemovePromo = () => {
    setDiscount(null);
    setPromoInput("");
    setPromoError(null);
  };

  const handleReview = (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setShowConfirm(true);
  };

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        items,
        subtotal,
        discount,
        total,
        fullName,
        address,
        userId: user.id,
      });
      clearCart();
      notify("Order placed successfully!");
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setError(err.message);
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <CheckoutSteps current={showConfirm ? 2 : 1} />
      <h1 className="mb-4">Checkout</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form noValidate validated={validated} onSubmit={handleReview}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your full name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a shipping address.
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" size="lg" className="w-100" disabled={!items.length}>
                  Review Order — {formatPrice(total)}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between px-0">
                    <span className="text-muted">
                      {item.title} &times; {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </ListGroup.Item>
                ))}
                {discount && (
                  <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                    <span>
                      Promo <span className="fw-semibold">{discount.code}</span>
                    </span>
                    <span>-{formatPrice(discount.amount)}</span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </ListGroup.Item>
              </ListGroup>

              <div className="mt-3">
                {discount ? (
                  <div className="d-flex justify-content-between align-items-center bg-success-subtle text-success-emphasis rounded p-2 px-3 small">
                    <span>
                      <i className="bi bi-check-circle me-1" />
                      {discount.code} applied
                    </span>
                    <Button variant="link" size="sm" className="p-0 text-success-emphasis" onClick={handleRemovePromo}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <InputGroup size="sm">
                      <Form.Control
                        placeholder="Promo code (try SAVE10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                      />
                      <Button variant="outline-secondary" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </InputGroup>
                    {promoError && <div className="text-danger small mt-1">{promoError}</div>}
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showConfirm} onHide={() => !submitting && setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Please review the details below before placing your order.
          </p>
          <dl className="row small mb-3">
            <dt className="col-sm-4">Ship to</dt>
            <dd className="col-sm-8">{fullName}</dd>
            <dt className="col-sm-4">Address</dt>
            <dd className="col-sm-8" style={{ whiteSpace: "pre-wrap" }}>
              {address}
            </dd>
          </dl>
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between px-0">
                <span className="text-muted">
                  {item.title} &times; {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </ListGroup.Item>
            ))}
            {discount && (
              <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                <span>Promo {discount.code}</span>
                <span>-{formatPrice(discount.amount)}</span>
              </ListGroup.Item>
            )}
            <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirm(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmOrder} disabled={submitting}>
            {submitting && <Spinner as="span" animation="border" size="sm" className="me-2" />}
            {submitting ? "Placing Order..." : "Confirm & Place Order"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;
