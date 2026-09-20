import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth.js";
import { useNotification } from "../hooks/useNotification.js";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [validated, setValidated] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    updateUser({ name: name.trim() });
    notify("Profile updated!");
    setValidated(true);
  };

  return (
    <div style={{ maxWidth: 480 }} className="mx-auto py-3">
      <h1 className="mb-4">My Profile</h1>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 64, height: 64 }}
            >
              <i className="bi bi-person-fill fs-2 text-primary" />
            </div>
            <div>
              <div className="fw-semibold">{user.name}</div>
              <div className="text-muted small">{user.email}</div>
            </div>
          </div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
              <Form.Control.Feedback type="invalid">
                Please enter your name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control value={user.email} disabled readOnly />
              <Form.Text className="text-muted">
                Email can't be changed on this demo — it's tied to your account, cart, and order history.
              </Form.Text>
            </Form.Group>
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
