import { useState } from "react";
import { Form, Button, Alert, Card, Row, Col, Spinner } from "react-bootstrap";
import { sendMessage } from "../api/contact.js";
import { useNotification } from "../hooks/useNotification.js";

const CONTACT_INFO = [
  { icon: "bi-geo-alt", label: "123 Reading Lane, Booktown, BT 45678" },
  { icon: "bi-telephone", label: "+1 (555) 123-4567" },
  { icon: "bi-envelope", label: "support@bookstore.example" },
  { icon: "bi-clock", label: "Mon–Fri: 9am–6pm, Sat: 10am–4pm" },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await sendMessage({ name, email, subject, message });
      notify("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setValidated(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="fw-bold">Get in Touch</h1>
        <p className="text-muted">Questions, feedback, or a book request? We'd love to hear from you.</p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a subject.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a message.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button type="submit" size="lg" disabled={submitting}>
                      {submitting && <Spinner as="span" animation="border" size="sm" className="me-2" />}
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title className="mb-4">Contact Information</Card.Title>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                {CONTACT_INFO.map(({ icon, label }) => (
                  <li key={label} className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44 }}
                    >
                      <i className={`bi ${icon} text-primary`} />
                    </div>
                    <span className="text-muted">{label}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
