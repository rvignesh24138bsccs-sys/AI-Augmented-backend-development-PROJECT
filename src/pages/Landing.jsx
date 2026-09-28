import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  const features = [
    { icon: "🔐", title: "Secure Auth", desc: "JWT-protected personal account with bcrypt encryption." },
    { icon: "💪", title: "Workout Tracking", desc: "Log, edit, search, and manage your full workout history." },
    { icon: "🤖", title: "AI Workout Plans", desc: "Google Gemini generates a personalized weekly workout program." },
    { icon: "📊", title: "Fitness Insights", desc: "AI analyses your stats and gives actionable progress advice." },
    { icon: "🔍", title: "Smart Search", desc: "Filter workouts by name, category, or date instantly." },
    { icon: "⚡", title: "Blazing Fast", desc: "Node.js + MongoDB backend with RESTful JSON responses." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Hero */}
      <div style={{
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(233,69,96,0.18), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0,212,170,0.1), transparent)",
        padding: "100px 24px 80px", textAlign: "center"
      }}>
        <div style={{ display: "inline-block", background: "rgba(233,69,96,0.12)", border: "1px solid rgba(233,69,96,0.3)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 600, color: "#e94560", marginBottom: 24 }}>
          Powered by Google Gemini AI ✨
        </div>
        <h1 style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
          <span style={{ background: "linear-gradient(135deg,#e94560,#9b2335)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FitTrack AI</span>
          <br />
          <span style={{ color: "var(--text-primary)" }}>Your Fitness,</span>{" "}
          <span style={{ background: "linear-gradient(135deg,#00d4aa,#00a080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Amplified.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Track workouts, get AI-powered plans, and unlock personalized fitness insights — all in one powerful backend-driven platform.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            🚀 Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Sign In
          </Link>
        </div>

        {/* Floating stats */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[
            { value: "10+", label: "API Endpoints" },
            { value: "AI", label: "Gemini Powered" },
            { value: "JWT", label: "Secure Auth" },
            { value: "NoSQL", label: "MongoDB" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, background: "linear-gradient(135deg,#e94560,#00d4aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Everything you need</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48 }}>A complete fitness management ecosystem</p>
        <div className="cards-grid">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "60px 24px 100px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to transform your fitness?</h2>
        <Link to="/register" className="btn btn-teal" style={{ fontSize: 16, padding: "14px 36px" }}>
          Start Tracking Now →
        </Link>
      </div>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
        FitTrack AI — Built with Node.js, Express, MongoDB &amp; Google Gemini
      </footer>
    </div>
  );
}
