import { useState } from "react";
import { Form, Button, Alert, InputGroup, Spinner } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth.js";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../components/AuthLayout.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search ?? ""}`
    : "/";

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const user = await loginApi({ email, password });
      login(user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
    setValidated(true);
  };

  return (
    <AuthLayout
      icon="bi-person-circle"
      title="Welcome Back"
      tagline="Pick up right where you left off with your next great read."
    >
      <h1 className="h3 mb-4">Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text>
              <i className="bi bi-envelope" />
            </InputGroup.Text>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text>
              <i className="bi bi-lock" />
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </Button>
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Button type="submit" className="w-100" size="lg" disabled={submitting}>
          {submitting && <Spinner as="span" animation="border" size="sm" className="me-2" />}
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <p className="mt-4 text-center text-muted small mb-0">
        No account?{" "}
        <Link to="/register" state={location.state}>
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
