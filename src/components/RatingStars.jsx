const RatingStars = ({ rating, reviewCount, size = "" }) => {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    if (rating >= i) return "bi-star-fill";
    if (rating >= i - 0.5) return "bi-star-half";
    return "bi-star";
  });

  return (
    <div className={`d-flex align-items-center gap-1 ${size}`}>
      <span className="text-warning">
        {stars.map((icon, i) => (
          <i key={i} className={`bi ${icon}`} />
        ))}
      </span>
      <span className="text-muted small">
        {rating.toFixed(1)}
        {reviewCount != null && ` (${reviewCount.toLocaleString()})`}
      </span>
    </div>
  );
};

export default RatingStars;
