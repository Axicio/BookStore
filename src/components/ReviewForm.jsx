import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a comment before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ rating, comment: comment.trim() });
      setComment("");
      setRating(5);
      setHoverRating(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex gap-3 align-items-start flex-wrap">
        <Form.Group>
          <Form.Label className="small d-block">Your Rating</Form.Label>
          <div className="fs-3" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <i
                key={n}
                role="button"
                tabIndex={0}
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                className={`bi ${displayRating >= n ? "bi-star-fill text-warning" : "bi-star text-muted"} me-1`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverRating(n)}
                onClick={() => setRating(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setRating(n);
                  }
                }}
              />
            ))}
          </div>
        </Form.Group>
        <Form.Group className="flex-grow-1" style={{ minWidth: 220 }}>
          <Form.Label className="small">Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think of this book?"
          />
        </Form.Group>
      </div>
      <Button type="submit" className="mt-3" disabled={submitting}>
        {submitting && <Spinner as="span" animation="border" size="sm" className="me-2" />}
        {submitting ? "Posting..." : "Post Review"}
      </Button>
    </Form>
  );
};

export default ReviewForm;
