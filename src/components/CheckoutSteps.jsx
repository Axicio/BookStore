const STEPS = ["Cart", "Shipping", "Review", "Confirmed"];

const CheckoutSteps = ({ current }) => (
  <div className="d-flex justify-content-center align-items-center flex-wrap mb-5">
    {STEPS.map((step, i) => (
      <div key={step} className="d-flex align-items-center">
        <div className="d-flex flex-column align-items-center" style={{ width: 84 }}>
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center fw-semibold ${
              i <= current ? "bg-primary text-white" : "bg-secondary-subtle text-secondary"
            }`}
            style={{ width: 34, height: 34 }}
          >
            {i < current ? <i className="bi bi-check-lg" /> : i + 1}
          </div>
          <span className={`small mt-1 text-center ${i === current ? "fw-semibold text-primary" : "text-muted"}`}>
            {step}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            style={{
              width: 40,
              height: 2,
              marginBottom: 20,
              background: i < current ? "var(--bs-primary)" : "var(--bs-secondary-bg)",
            }}
          />
        )}
      </div>
    ))}
  </div>
);

export default CheckoutSteps;
