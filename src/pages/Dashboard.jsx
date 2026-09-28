import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "14px",
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px"
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>{value}</div>
          {sub && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{value} / {max}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: "3px", transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/workouts").then(r => { setWorkouts(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const avgDuration = totalWorkouts ? Math.round(workouts.reduce((s, w) => s + (w.duration || 0), 0) / totalWorkouts) : 0;
  const thisWeek = workouts.filter(w => (new Date() - new Date(w.workoutDate)) < 7 * 86400000).length;

  const categoryCount = workouts.reduce((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good Morning" : greetingHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #1a0a1e 100%)",
        border: "1px solid var(--border)", borderRadius: "20px",
        padding: "36px", marginBottom: "32px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(233,69,96,0.15), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "20%", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(0,212,170,0.12), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "var(--accent-teal)", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>⚡ {greeting}</p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: "8px" }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "Athlete"}</span>!
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "480px", marginBottom: "24px", fontSize: "14px" }}>
            {user?.fitnessGoal ? `Goal: ${user.fitnessGoal} · Level: ${user.experienceLevel}` : "Keep pushing your limits — every workout counts!"}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/workouts" className="btn btn-primary">➕ Log Workout</Link>
            <Link to="/ai-recommendation" className="btn btn-teal">🤖 Get AI Plan</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="💪" label="Total Workouts" value={totalWorkouts} color="#e94560" sub="All time" />
        <StatCard icon="🔥" label="Calories Burned" value={totalCalories.toLocaleString()} color="#ffa800" sub="kcal total" />
        <StatCard icon="⏱" label="Avg. Duration" value={`${avgDuration} min`} color="#00d4aa" sub="per session" />
        <StatCard icon="📅" label="This Week" value={thisWeek} color="#4f8ef7" sub="sessions" />
      </div>

      {/* Progress + Recent */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        {/* Progress Bars */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>📈 Weekly Progress</h3>
          <ProgressBar label="Sessions" value={thisWeek} max={5} color="#e94560" />
          <ProgressBar label="Calories" value={Math.min(totalCalories, 2000)} max={2000} color="#ffa800" />
          <ProgressBar label="Avg Duration" value={avgDuration} max={60} color="#00d4aa" />
          {topCategory && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Top Category</div>
              <div style={{ fontWeight: 700, marginTop: "4px" }}>{topCategory[0]} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "13px" }}>({topCategory[1]} sessions)</span></div>
            </div>
          )}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { to: "/workouts", icon: "💪", label: "My Workouts", color: "#e94560" },
              { to: "/ai-recommendation", icon: "🤖", label: "AI Workout Plan", color: "#00d4aa" },
              { to: "/ai-insights", icon: "📊", label: "Fitness Insights", color: "#4f8ef7" },
            ].map(({ to, icon, label, color }) => (
              <Link key={to} to={to} style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                borderRadius: "8px", background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)"
              }}>
                <span>{icon}</span><span style={{ flex: 1 }}>{label}</span><span style={{ color }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 700 }}>Recent Workouts</h3>
            <Link to="/workouts" style={{ color: "var(--accent-teal)", fontSize: "13px", fontWeight: 600 }}>View all →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : workouts.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🏋️</div>
              <h3>No workouts yet</h3>
              <p style={{ fontSize: "14px" }}>Start logging your fitness journey!</p>
            </div>
          ) : (
            workouts.slice(0, 6).map(w => {
              const cat = (w.category || "default").toLowerCase();
              const cls = ["cardio","strength","yoga","hiit"].includes(cat) ? cat : "default";
              return (
                <div key={w._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{w.workoutName}</div>
                    <span className={`badge badge-${cls}`} style={{ marginTop: "4px" }}>{w.category}</span>
                  </div>
                  <div style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: "13px" }}>
                    <div>⏱ {w.duration} min</div>
                    <div>🔥 {w.caloriesBurned} kcal</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
