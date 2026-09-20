import { useState } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown, Button, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useWishlist } from "../../hooks/useWishlist.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";

const AppNavbar = () => {
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isActive = (path) => location.pathname === path;
  const navLinkClass = (path) => `nav-underline ${isActive(path) ? "active-link" : ""}`;

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3 no-print">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-book-half fs-4 text-warning" />
          BookStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            <button
              type="button"
              className={`theme-switch ${theme === "dark" ? "theme-switch-dark" : ""} me-lg-2`}
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <span className="theme-switch-thumb">
                <i className={`bi ${theme === "dark" ? "bi-moon-stars-fill" : "bi-sun-fill"}`} />
              </span>
            </button>
            <Nav.Link as={Link} to="/" className={navLinkClass("/")}>
              <i className="bi bi-house-door me-1" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className={navLinkClass("/contact")}>
              <i className="bi bi-envelope me-1" />
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/wishlist" className={`position-relative ${navLinkClass("/wishlist")}`}>
              <i className="bi bi-heart me-1" />
              Wishlist
              {wishlistItems.length > 0 && (
                <Badge key={wishlistItems.length} bg="danger" pill className="ms-1 badge-pop">
                  {wishlistItems.length}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className={`position-relative ${navLinkClass("/cart")}`}>
              <i className="bi bi-cart3 me-1" />
              Cart
              {itemCount > 0 && (
                <Badge key={itemCount} bg="info" pill className="ms-1 badge-pop">
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>
            {user ? (
              <NavDropdown
                title={
                  <span>
                    <i className="bi bi-person-circle me-1" />
                    {user.name}
                  </span>
                }
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2" />
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/library">
                  <i className="bi bi-collection me-2" />
                  My Library
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  <i className="bi bi-receipt me-2" />
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setShowLogoutConfirm(true)}>
                  <i className="bi bi-box-arrow-right me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className={navLinkClass("/login")}>
                <i className="bi bi-box-arrow-in-right me-1" />
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Modal show={showLogoutConfirm} onHide={() => setShowLogoutConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowLogoutConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default AppNavbar;
