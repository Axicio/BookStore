import { Row, Col } from "react-bootstrap";
import BookCard from "./BookCard.jsx";

const BookGrid = ({ books, onAddToCart, emptyMessage = "No books found." }) => {
  if (!books?.length) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-emoji-frown fs-1 d-block mb-2" />
        {emptyMessage}
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} className="g-4">
      {books.map((book, index) => (
        <Col key={book.id}>
          <BookCard book={book} onAddToCart={onAddToCart} index={index} />
        </Col>
      ))}
    </Row>
  );
};

export default BookGrid;
