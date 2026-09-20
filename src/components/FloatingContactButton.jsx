import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, ListGroup } from "react-bootstrap";

const CONTACT_METHODS = [
  { icon: "bi-envelope", label: "support@bookstore.example", href: "mailto:support@bookstore.example" },
  { icon: "bi-telephone", label: "+1 (555) 123-4567", href: "tel:+15551234567" },
];

const FloatingContactButton = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const hasPulsedRef = useRef(false);
  const wrapperRef = useRef(null);

  // Show the button only after the user has scrolled past the fold.
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setVisible(shouldShow);
      if (!shouldShow) setOpen(false);
      if (shouldShow && !hasPulsedRef.current) {
        hasPulsedRef.current = true;
        setPulse(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the panel when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!visible) return null;

  return (
    <div
      ref={wrapperRef}
      className="position-fixed no-print"
      style={{ bottom: 24, left: 24, zIndex: 1050 }}
    >
      <Card
        className={`shadow-lg border-0 mb-2 contact-panel ${open ? "contact-panel-open" : ""}`}
        style={{ width: 260 }}
        aria-hidden={!open}
      >
        <Card.Body className="p-3">
          <Card.Title className="h6 mb-3">
            <i className="bi bi-headset me-2" />
            Need Help?
          </Card.Title>
          <ListGroup variant="flush">
            {CONTACT_METHODS.map(({ icon, label, href }) => (
              <ListGroup.Item
                key={label}
                action
                href={href}
                onClick={() => setOpen(false)}
                className="d-flex align-items-center gap-2 px-0"
              >
                <i className={`bi ${icon} text-primary`} />
                {label}
              </ListGroup.Item>
            ))}
            <ListGroup.Item
              action
              as={Link}
              to="/contact"
              onClick={() => setOpen(false)}
              className="d-flex align-items-center gap-2 px-0"
            >
              <i className="bi bi-chat-dots text-primary" />
              Contact Form
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
      <Button
        className={`fab-gradient rounded-circle shadow d-flex align-items-center justify-content-center p-0 ${
          pulse ? "fab-pulse-once" : ""
        }`}
        style={{ width: 56, height: 56 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close contact options" : "Contact us"}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-headset"} fs-5 text-white`} />
      </Button>
    </div>
  );
};

export default FloatingContactButton;
