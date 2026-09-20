import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button, Spinner, Alert, Badge, Breadcrumb, Card, InputGroup, Form } from "react-bootstrap";
import { getBookById, getRelatedBooks } from "../api/books.js";
import { getReviews, addReview } from "../api/reviews.js";
import { useCart } from "../hooks/useCart.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useAuth } from "../hooks/useAuth.js";
import { useNotification } from "../hooks/useNotification.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { useNotifyRequests } from "../hooks/useNotifyRequests.js";
import { formatPrice } from "../utils/formatPrice.js";
import { getCategoryBadgeClass } from "../utils/categoryColors.js";
import RatingStars from "../components/RatingStars.jsx";
import BookGrid from "../components/BookGrid.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

const BookDetails = () => {
  const { bookId } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { notify } = useNotification();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { isRequested, requestNotify } = useNotifyRequests();

  const handleAddToCart = () => {
    addItem(book, quantity);
    notify(`Added ${quantity} × "${book.title}" to cart`);
    setQuantity(1);
  };

  const adjustQuantity = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleNotifyMe = () => {
    requestNotify(book.id);
    notify(`We'll email you when "${book.title}" is back in stock.`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Link copied to clipboard!");
    } catch {
      notify("Couldn't copy the link — copy it from the address bar instead.", {
        variant: "danger",
      });
    }
  };

  const handleToggleWishlist = () => {
    const wasWishlisted = isWishlisted(book.id);
    toggleWishlist(book);
    if (wasWishlisted) {
      notify(`Removed "${book.title}" from wishlist`, {
        variant: "secondary",
        action: { label: "Undo", onClick: () => toggleWishlist(book) },
      });
    }
  };

  useEffect(() => {
    getBookById(bookId)
      .then(setBook)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  useEffect(() => {
    if (!book) return;
    getRelatedBooks(book.id, book.category)
      .then(setRelatedBooks)
      .catch(() => {});
    getReviews(book.id)
      .then(setReviews)
      .catch(() => {});
    addRecentlyViewed(book);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- addRecentlyViewed is stable per render and re-adding it would refire this on every keystroke elsewhere
  }, [book]);

  const handleAddReview = async ({ rating, comment }) => {
    const review = await addReview(book.id, { author: user.name, rating, comment });
    setReviews((prev) => [review, ...prev]);
    notify("Thanks for your review!");
  };

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
  if (!book) return <p>Book not found.</p>;

  const wishlisted = isWishlisted(book.id);

  return (
    <div>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{book.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="row g-5">
        <div className="col-md-5 col-lg-4">
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="img-fluid rounded-4 shadow-sm w-100 img-fade-in"
            />
          )}
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="d-flex gap-2 mb-2">
            <Badge bg={null} pill className={getCategoryBadgeClass(book.category)}>
              {book.category}
            </Badge>
            {book.inStock ? (
              <Badge bg="success-subtle" text="success-emphasis">
                <i className="bi bi-check-circle me-1" />
                In Stock
              </Badge>
            ) : (
              <Badge bg="dark">Out of Stock</Badge>
            )}
          </div>
          <h1>{book.title}</h1>
          <h5 className="text-muted fw-normal mb-2">by {book.author}</h5>
          <div className="mb-3">
            <RatingStars rating={book.rating} reviewCount={book.reviewCount} />
          </div>
          <p className="display-6 fw-bold text-primary">{formatPrice(book.price)}</p>
          <p className="text-body-secondary" style={{ maxWidth: 640 }}>
            {book.description}
          </p>
          <div className="d-flex gap-2 mt-2 align-items-start flex-wrap">
            {book.inStock && (
              <InputGroup style={{ width: 130 }}>
                <Button
                  variant="outline-secondary"
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <i className="bi bi-dash" />
                </Button>
                <Form.Control
                  className="text-center"
                  value={quantity}
                  readOnly
                  aria-label="Quantity"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => adjustQuantity(1)}
                  aria-label="Increase quantity"
                >
                  <i className="bi bi-plus" />
                </Button>
              </InputGroup>
            )}
            {book.inStock ? (
              <Button size="lg" onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-2" />
                Add to Cart
              </Button>
            ) : (
              <Button
                size="lg"
                variant={isRequested(book.id) ? "outline-success" : "outline-secondary"}
                onClick={handleNotifyMe}
                disabled={isRequested(book.id)}
              >
                <i className={`bi ${isRequested(book.id) ? "bi-check-circle" : "bi-bell"} me-2`} />
                {isRequested(book.id) ? "We'll Notify You" : "Notify Me When Available"}
              </Button>
            )}
            <Button
              size="lg"
              variant={wishlisted ? "danger" : "outline-secondary"}
              onClick={handleToggleWishlist}
            >
              <i key={wishlisted} className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"} heart-pop`} />
            </Button>
            <Button size="lg" variant="outline-secondary" onClick={handleShare} aria-label="Share this book">
              <i className="bi bi-share" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5" style={{ maxWidth: 720 }}>
        <h2 className="h4 fw-semibold mb-4">Customer Reviews ({reviews.length})</h2>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            {user ? (
              <ReviewForm onSubmit={handleAddReview} />
            ) : (
              <p className="mb-0 text-muted">
                <Link to="/login" state={{ from: location }}>
                  Login
                </Link>{" "}
                to write a review.
              </p>
            )}
          </Card.Body>
        </Card>
        <ReviewList reviews={reviews} />
      </div>

      {relatedBooks.length > 0 && (
        <div className="mt-5">
          <h2 className="h4 fw-semibold mb-4">You Might Also Like</h2>
          <BookGrid books={relatedBooks} onAddToCart={(b) => { addItem(b); notify(`Added "${b.title}" to cart`); }} />
        </div>
      )}
    </div>
  );
};

export default BookDetails;
