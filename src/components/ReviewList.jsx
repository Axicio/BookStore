import RatingStars from "./RatingStars.jsx";

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ReviewList = ({ reviews }) => {
  if (!reviews.length) {
    return <p className="text-muted">No reviews yet. Be the first to share your thoughts.</p>;
  }

  return (
    <div className="d-flex flex-column gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="d-flex gap-3">
          <div
            className="rounded-circle bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center flex-shrink-0 fw-semibold"
            style={{ width: 44, height: 44 }}
          >
            {initials(review.author)}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-semibold">{review.author}</span>
              <span className="text-muted small">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <RatingStars rating={review.rating} />
            <p className="mb-0 mt-1 text-body-secondary">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
