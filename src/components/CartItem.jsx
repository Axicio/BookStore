import { Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice.js";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <Row className="align-items-center py-3 border-bottom g-3">
      <Col xs={3} sm={2}>
        {item.coverUrl && (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="img-fluid rounded object-fit-cover img-fade-in"
            style={{ height: 80, width: "100%" }}
          />
        )}
      </Col>
      <Col xs={9} sm={4}>
        <Link to={`/books/${item.id}`} className="fw-semibold text-body text-decoration-none">
          {item.title}
        </Link>
        <div className="text-muted small">{formatPrice(item.price)} each</div>
      </Col>
      <Col xs={7} sm={3}>
        <Form.Control
          type="number"
          min={1}
          max={99}
          value={item.quantity}
          onChange={(e) => {
            const value = Math.floor(Number(e.target.value));
            // Always propagate — CartContext.setQuantity clamps to a valid
            // range, so the input never gets stuck out of sync with it.
            onQuantityChange?.(item.id, Number.isFinite(value) ? value : 1);
          }}
        />
      </Col>
      <Col xs={3} sm={2} className="fw-semibold">
        {formatPrice(item.price * item.quantity)}
      </Col>
      <Col xs={2} sm={1} className="text-end">
        <Button
          variant="link"
          className="text-danger p-0"
          onClick={() => onRemove?.(item.id)}
          aria-label={`Remove ${item.title}`}
        >
          <i className="bi bi-trash fs-5" />
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;
