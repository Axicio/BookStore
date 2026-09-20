import { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { getOrders } from "../api/orders.js";
import { useAuth } from "../hooks/useAuth.js";
import { createPlaceholderPdf, createPlaceholderEpub } from "../utils/placeholderFiles.js";
import { downloadBlob } from "../utils/downloadBlob.js";
import EmptyState from "../components/EmptyState.jsx";

const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Library = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders(user.id)
      .then((orders) => {
        const owned = new Map();
        orders.forEach((order) => {
          order.items.forEach((item) => {
            if (!owned.has(item.id)) owned.set(item.id, item);
          });
        });
        setBooks([...owned.values()]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleDownload = (book, format) => {
    const blob =
      format === "pdf" ? createPlaceholderPdf(book) : createPlaceholderEpub(book);
    downloadBlob(blob, `${slugify(book.title)}.${format}`);
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

  if (!books.length) {
    return (
      <EmptyState
        icon="bi-collection"
        title="Your Library is Empty"
        message="Books you purchase will show up here."
        actionLabel="Browse Books"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-2">My Library</h1>
      <p className="text-muted mb-4">
        <i className="bi bi-info-circle me-1" />
        Demo downloads contain placeholder text only — not the actual book content.
      </p>
      <Row className="g-4">
        {books.map((book) => (
          <Col key={book.id} xs={12} sm={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Row className="g-0 h-100">
                <Col xs={4}>
                  {book.coverUrl && (
                    <Card.Img
                      src={book.coverUrl}
                      alt={book.title}
                      className="h-100 object-fit-cover rounded-start img-fade-in"
                    />
                  )}
                </Col>
                <Col xs={8}>
                  <Card.Body className="d-flex flex-column h-100">
                    <Card.Title className="h6">{book.title}</Card.Title>
                    <Card.Subtitle className="text-muted small mb-3">
                      {book.author}
                    </Card.Subtitle>
                    <div className="mt-auto d-flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleDownload(book, "pdf")}
                      >
                        <i className="bi bi-file-earmark-pdf me-1" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleDownload(book, "epub")}
                      >
                        <i className="bi bi-file-earmark-text me-1" />
                        EPUB
                      </Button>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Library;
