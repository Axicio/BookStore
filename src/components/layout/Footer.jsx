import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer text-light mt-auto no-print">
      <div className="footer-gradient-bar" />
      <Container className="pt-5 pb-4">
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="d-flex align-items-center gap-2 font-heading">
              <i className="bi bi-book-half text-warning" />
              BookStore
            </h5>
            <p className="text-secondary small mb-0">
              Your neighborhood shop for great reads, delivered to your door.
            </p>
          </Col>
          <Col md={4}>
            <h6 className="text-uppercase text-secondary small mb-3 footer-heading-accent">Shop</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="text-uppercase text-secondary small mb-3 footer-heading-accent">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="link-light social-icon" aria-label="Twitter">
                <i className="bi bi-twitter-x" />
              </a>
              <a href="#" className="link-light social-icon" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="link-light social-icon" aria-label="Facebook">
                <i className="bi bi-facebook" />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="border-secondary my-4" />
        <p className="text-secondary small text-center mb-0">
          &copy; {new Date().getFullYear()} BookStore. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
