import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useNotification } from "../hooks/useNotification.js";
import { useNotifyRequests } from "../hooks/useNotifyRequests.js";
import { getCategoryBadgeClass } from "../utils/categoryColors.js";
import RatingStars from "./RatingStars.jsx";

const BookCard = ({ book, onAddToCart, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { notify } = useNotification();
  const { isRequested, requestNotify } = useNotifyRequests();
  const wishlisted = isWishlisted(book.id);
  const notified = isRequested(book.id);

  const handleNotifyMe = () => {
    requestNotify(book.id);
    notify(`We'll email you when "${book.title}" is back in stock.`);
  };

  const handleToggleWishlist = () => {
    const wasWishlisted = wishlisted;
    toggleWishlist(book);
    if (wasWishlisted) {
      notify(`Removed "${book.title}" from wishlist`, {
        variant: "secondary",
        action: { label: "Undo", onClick: () => toggleWishlist(book) },
      });
    }
  };

  return (
    <Card
      className={`h-100 border-0 animate-fade-in-up ${hovered ? "shadow" : "shadow-sm"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "transform 0.15s ease",
        animationDelay: `${Math.min(index, 7) * 0.05}s`,
      }}
    >
      <div className="position-relative book-cover-frame">
        <Link to={`/books/${book.id}`}>
          {book.coverUrl && (
            <Card.Img
              variant="top"
              src={book.coverUrl}
              alt={book.title}
              className="object-fit-cover img-fade-in"
              style={{ height: 260 }}
            />
          )}
        </Link>
        <Button
          variant={wishlisted ? "danger" : "light"}
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: 34, height: 34 }}
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i key={wishlisted} className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"} heart-pop`} />
        </Button>
        {!book.inStock && (
          <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Badge bg={null} pill className={`mb-2 align-self-start ${getCategoryBadgeClass(book.category)}`}>
          {book.category}
        </Badge>
        <Card.Title as={Link} to={`/books/${book.id}`} className="text-body text-decoration-none">
          {book.title}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted small">{book.author}</Card.Subtitle>
        <RatingStars rating={book.rating} reviewCount={book.reviewCount} />
        <Card.Text className="mt-auto fs-5 fw-bold text-primary pt-2">
          {formatPrice(book.price)}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button as={Link} to={`/books/${book.id}`} variant="outline-secondary" size="sm" className="flex-fill">
            Details
          </Button>
          {book.inStock ? (
            <Button
              onClick={() => onAddToCart?.(book)}
              variant="primary"
              size="sm"
              className="flex-fill"
            >
              <i className="bi bi-cart-plus me-1" />
              Add
            </Button>
          ) : (
            <Button
              onClick={handleNotifyMe}
              variant={notified ? "outline-success" : "outline-secondary"}
              size="sm"
              className="flex-fill"
              disabled={notified}
            >
              <i className={`bi ${notified ? "bi-check-circle" : "bi-bell"} me-1`} />
              {notified ? "Notified" : "Notify Me"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
