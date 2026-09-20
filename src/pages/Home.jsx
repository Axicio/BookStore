import { useEffect, useState, useMemo } from "react";
import { Form, InputGroup, Alert, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import BookGrid from "../components/BookGrid.jsx";
import BookCardSkeleton from "../components/BookCardSkeleton.jsx";
import { getBooks, getCategories } from "../api/books.js";
import { useCart } from "../hooks/useCart.js";
import { useNotification } from "../hooks/useNotification.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { getCategoryBadgeClass, getCategoryIcon } from "../utils/categoryColors.js";

const SORT_OPTIONS = {
  featured: { label: "Featured", compare: null },
  "price-asc": { label: "Price: Low to High", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: High to Low", compare: (a, b) => b.price - a.price },
  "title-asc": { label: "Title: A to Z", compare: (a, b) => a.title.localeCompare(b.title) },
  "rating-desc": { label: "Highest Rated", compare: (a, b) => b.rating - a.rating },
};

const PRICE_RANGES = {
  all: { label: "Any Price", test: null },
  under15: { label: "Under $15", test: (p) => p < 15 },
  "15to30": { label: "$15 – $30", test: (p) => p >= 15 && p <= 30 },
  over30: { label: "Over $30", test: (p) => p > 30 },
};

const RATING_OPTIONS = {
  all: { label: "Any Rating", min: 0 },
  "4plus": { label: "4★ & up", min: 4 },
  "4.5plus": { label: "4.5★ & up", min: 4.5 },
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sort, setSort] = useState("featured");
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { notify } = useNotification();
  const { recentlyViewed } = useRecentlyViewed();
  const categories = getCategories();

  const handleAddToCart = (book) => {
    addItem(book);
    notify(`Added "${book.title}" to cart`);
  };

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = books;
    if (category !== "All") {
      result = result.filter((book) => book.category === category);
    }
    const priceTest = PRICE_RANGES[priceRange].test;
    if (priceTest) {
      result = result.filter((book) => priceTest(book.price));
    }
    const ratingMin = RATING_OPTIONS[minRating].min;
    if (ratingMin > 0) {
      result = result.filter((book) => book.rating >= ratingMin);
    }
    if (q) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
      );
    }
    const { compare } = SORT_OPTIONS[sort];
    if (compare) {
      result = [...result].sort(compare);
    }
    return result;
  }, [books, query, category, priceRange, minRating, sort]);

  // Ignores the active category/price/rating filters on purpose — suggestions
  // should surface a match regardless of what the grid below is filtered to.
  const searchSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 6);
  }, [books, query]);

  const showSuggestions = searchFocused && searchSuggestions.length > 0;

  return (
    <div>
      <div className="hero-banner p-4 p-md-5 pb-5 mb-5 rounded-4 border position-relative">
        <div className="text-center mx-auto position-relative" style={{ maxWidth: 560 }}>
          <h1 className="display-5 fw-bold hero-gradient-text">Discover your next favorite book</h1>
          <p className="text-body-secondary mb-4">
            Browse our curated collection of bestsellers, classics, and hidden gems.
          </p>
          <InputGroup size="lg">
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              autoComplete="off"
            />
          </InputGroup>
          {showSuggestions && (
            <ListGroup className="search-suggestions position-absolute w-100 shadow-lg mt-1 text-start">
              {searchSuggestions.map((b) => (
                <ListGroup.Item
                  key={b.id}
                  action
                  as={Link}
                  to={`/books/${b.id}`}
                  className="d-flex align-items-center gap-3"
                >
                  {b.coverUrl && (
                    <img
                      src={b.coverUrl}
                      alt=""
                      className="rounded object-fit-cover flex-shrink-0"
                      style={{ width: 32, height: 44 }}
                    />
                  )}
                  <div>
                    <div className="fw-semibold">{b.title}</div>
                    <div className="text-muted small">{b.author}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        <svg
          className="position-absolute bottom-0 start-0 w-100"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: 40, display: "block" }}
          aria-hidden="true"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" style={{ fill: "var(--bs-body-bg)" }} />
        </svg>
      </div>

      {recentlyViewed.length > 0 && (
        <>
          <div className="mb-5">
            <h2 className="h5 fw-semibold mb-3">
              <i className="bi bi-clock-history me-2" />
              Recently Viewed
            </h2>
            <BookGrid books={recentlyViewed} onAddToCart={handleAddToCart} />
          </div>
          <div className="section-divider mb-5" />
        </>
      )}

      {loading ? (
        <Row xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} className="g-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Col key={i}>
              <BookCardSkeleton />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              className={`chip chip-all ${category === "All" ? "active" : ""}`}
              onClick={() => setCategory("All")}
            >
              <i className="bi bi-grid me-1" />
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${category === c ? `active ${getCategoryBadgeClass(c)}` : ""}`}
                onClick={() => setCategory(c)}
              >
                <i className={`bi ${getCategoryIcon(c)} me-1`} />
                {c}
              </button>
            ))}
          </div>
          <Row className="align-items-center mb-4 g-3">
            <Col xs={12} md>
              <h2 className="h4 fw-semibold mb-0">
                {query ? `Results for "${query}"` : "Featured Books"}
              </h2>
            </Col>
            <Col xs={6} md="auto">
              <Form.Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                {Object.entries(PRICE_RANGES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md="auto">
              <Form.Select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                {Object.entries(RATING_OPTIONS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md="auto">
              <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <BookGrid
            books={filteredBooks}
            onAddToCart={handleAddToCart}
            emptyMessage={
              query ? `No books match "${query}".` : "No books match these filters."
            }
          />
        </>
      )}
    </div>
  );
};

export default Home;
