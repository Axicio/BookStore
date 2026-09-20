import { Row, Col } from "react-bootstrap";

const AuthLayout = ({ icon, title, tagline, children }) => (
  <div className="d-flex justify-content-center py-3">
    <Row className="g-0 shadow-lg rounded-4 overflow-hidden mx-auto w-100" style={{ maxWidth: 900 }}>
      <Col
        md={5}
        className="auth-gradient-panel d-none d-md-flex flex-column justify-content-center text-center text-white p-5"
      >
        <i className={`bi ${icon} display-1 mb-3`} />
        <h2 className="font-heading">{title}</h2>
        <p className="mb-0 opacity-75">{tagline}</p>
      </Col>
      <Col md={7} className="bg-body p-4 p-md-5 d-flex flex-column justify-content-center">
        {children}
      </Col>
    </Row>
  </div>
);

export default AuthLayout;
