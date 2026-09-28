import { useEffect, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const colors = ["#e94560", "#00d4aa", "#4f8ef7", "#ffa800", "#9b63ff", "#ff6b6b"];
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const startAngle = cumulative * 360;
    const endAngle = (cumulative + pct) * 360;
    cumulative += pct;
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
    const largeArc = pct > 0.5 ? 1 : 0;
    return { ...d, path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`, color: colors[i % colors.length] };
  });

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
      <svg viewBox="0 0 100 100" width="160" height="160" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#0a0a0f" strokeWidth="0.5" />)}
        <circle cx="50" cy="50" r="22" fill="#0a0a0f" />
        <text x="50" y="47" textAnchor="middle" fill="#f0f0f0" fontSize="8" fontWeight="bold">{total}</text>
        <text x="50" y="56" textAnchor="middle" fill="#9090a8" fontSize="5.5">sessions</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{s.label}</span>
            <span style={{ fontSize: "13px", fontWeight: 700, marginLeft: "4px" }}>{s.value}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({Math.round(s.value / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const [insightsRes, workoutsRes] = await Promise.all([
        api.get("/ai/insights"),
        api.get("/workouts")
      ]);
      setInsights(insightsRes.data.data);
      setStats(insightsRes.data.stats);

      const cats = {};
      (workoutsRes.data.data || []).forEach(w => { cats[w.category] = (cats[w.category] || 0) + 1; });
      setCategoryData(Object.entries(cats).map(([label, value]) => ({ label, value })));
      toast("Insights loaded!", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load insights. Log some workouts first.");
      toast("Could not load insights", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>📊 AI Fitness <span className="gradient-text">Insights</span></h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "14px" }}>Automated performance analysis based on your workout data.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchInsights} disabled={loading}>🔄 Refresh</button>
      </div>

      {loading && (
        <div className="glass-card spinner-wrap" style={{ minHeight: "300px", flexDirection: "column", gap: "16px" }}>
          <div className="spinner" />
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Analyzing with Gemini AI...</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-card" style={{ padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
          <h3 style={{ marginBottom: "8px" }}>Insights Unavailable</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Stat Cards */}
          {stats && (
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Sessions</div>
                <div style={{ fontSize: "26px", fontWeight: 800, marginTop: "4px", color: "var(--accent-red)" }}>{stats.totalWorkouts}</div>
              </div>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Avg Duration</div>
                <div style={{ fontSize: "26px", fontWeight: 800, marginTop: "4px", color: "var(--accent-teal)" }}>{stats.averageDuration} min</div>
              </div>
              <div className="glass-card" style={{ padding: "20px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Calories Burned</div>
                <div style={{ fontSize: "26px", fontWeight: 800, marginTop: "4px", color: "#ffa800" }}>{stats.totalCaloriesBurned?.toLocaleString()} kcal</div>
              </div>
            </div>
          )}

          {/* Pie Chart + Analysis */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {categoryData.length > 0 && (
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>📈 Workout by Category</h3>
                <PieChart data={categoryData} />
              </div>
            )}
            {insights?.performanceAnalysis && (
              <div className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ color: "var(--accent-teal)", marginBottom: "12px", fontWeight: 700 }}>🏆 Performance Analysis</h3>
                <p style={{ color: "var(--text-primary)", lineHeight: "1.7", fontSize: "14px" }}>{insights.performanceAnalysis}</p>
              </div>
            )}
          </div>

          {insights?.improvementSuggestions && (
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ color: "#ffa800", marginBottom: "16px", fontWeight: 700 }}>💡 Improvement Suggestions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {insights.improvementSuggestions.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#ffa800", fontWeight: 700, marginTop: "1px" }}>✓</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights?.progressSummary && (
            <div className="glass-card" style={{ padding: "24px" }}>
              <h3 style={{ color: "var(--accent-blue)", marginBottom: "12px", fontWeight: 700 }}>🎯 Progress Summary</h3>
              <p style={{ color: "var(--text-primary)", lineHeight: "1.7", fontSize: "14px" }}>{insights.progressSummary}</p>
            </div>
          )}

          {insights?.motivationalAdvice && (
            <div className="glass-card" style={{ padding: "20px", background: "linear-gradient(135deg, rgba(233,69,96,0.08), rgba(0,212,170,0.05))" }}>
              <div style={{ fontWeight: 700, color: "var(--accent-red)", marginBottom: "6px" }}>⚡ Daily Motivation</div>
              <p style={{ fontStyle: "italic", color: "var(--text-primary)" }}>"{insights.motivationalAdvice}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
