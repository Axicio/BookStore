const COLORS = ["#6d4aff", "#ff5da2", "#ffb238", "#22c55e", "#38bdf8"];
const PIECE_COUNT = 36;

// Generated once when this module loads (plain JS, not during a component's
// render), so no impure call happens inside render/hooks — see the purity
// rule this sidesteps. The trade-off: the exact layout repeats if more than
// one order is confirmed in the same session, which is unnoticeable here.
const PIECES = Array.from({ length: PIECE_COUNT }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.4,
  duration: 1.8 + Math.random() * 1.2,
  color: COLORS[i % COLORS.length],
  rotate: Math.random() * 360,
  drift: (Math.random() - 0.5) * 200,
}));

const ConfettiBurst = () => (
  <div className="confetti-container" aria-hidden="true">
    {PIECES.map((p) => (
      <span
        key={p.id}
        className="confetti-piece"
        style={{
          left: `${p.left}%`,
          backgroundColor: p.color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          "--confetti-drift": `${p.drift}px`,
          "--confetti-rotate": `${p.rotate}deg`,
        }}
      />
    ))}
  </div>
);

export default ConfettiBurst;
