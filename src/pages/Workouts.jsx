import { useEffect, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function getBadgeClass(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("cardio")) return "cardio";
  if (c.includes("strength")) return "strength";
  if (c.includes("yoga")) return "yoga";
  if (c.includes("hiit")) return "hiit";
  return "default";
}

const EMPTY_FORM = { workoutName: "", category: "", duration: "", caloriesBurned: "", workoutDate: "" };
const CATEGORIES = ["Cardio","Strength","Yoga","HIIT","Flexibility","Cycling","Swimming","Running","Other"];

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: "", category: "", date: "" });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchWorkouts = async () => {
    setLoading(true);
    const params = {};
    if (search.name) params.name = search.name;
    if (search.category) params.category = search.category;
    if (search.date) params.date = search.date;
    const endpoint = (search.name || search.category || search.date) ? "/workouts/search" : "/workouts";
    const r = await api.get(endpoint, { params }).catch(() => ({ data: { data: [] } }));
    setWorkouts(r.data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const openAdd = () => { setForm({ ...EMPTY_FORM, workoutDate: new Date().toISOString().slice(0,10) }); setEditId(null); setError(""); setShowModal(true); };
  const openEdit = (w) => {
    setForm({ workoutName: w.workoutName, category: w.category, duration: w.duration, caloriesBurned: w.caloriesBurned, workoutDate: w.workoutDate?.slice(0, 10) });
    setEditId(w._id); setError(""); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true); setError("");
    try {
      if (editId) { await api.put(`/workouts/${editId}`, form); toast("Workout updated! ✅", "success"); }
      else { await api.post("/workouts", form); toast("Workout added! 💪", "success"); }
      setShowModal(false); setForm(EMPTY_FORM); setEditId(null);
      fetchWorkouts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed. Please check your inputs.");
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this workout?")) return;
    await api.delete(`/workouts/${id}`).catch(() => {});
    fetchWorkouts();
    toast("Workout deleted.", "info");
  };

  // Statistics
  const totalWorkouts = workouts.length;
  const totalCals = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const totalMins = workouts.reduce((s, w) => s + (w.duration || 0), 0);
  const bestCals = workouts.reduce((max, w) => Math.max(max, w.caloriesBurned || 0), 0);
  const longestSession = workouts.reduce((max, w) => Math.max(max, w.duration || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💪 My <span className="gradient-text">Workouts</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Workout</button>
      </div>

      {/* Stats Summary */}
      {totalWorkouts > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { icon: "💪", label: "Sessions", value: totalWorkouts, color: "#e94560" },
            { icon: "🔥", label: "Total Kcal", value: totalCals.toLocaleString(), color: "#ffa800" },
            { icon: "⏱", label: "Total Mins", value: totalMins, color: "#00d4aa" },
            { icon: "🏆", label: "Best Burn", value: `${bestCals} kcal`, color: "#4f8ef7" },
            { icon: "⚡", label: "Longest", value: `${longestSession} min`, color: "#9b63ff" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "20px" }}>{icon}</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color, marginTop: "4px" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: "20px", marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="input-group" style={{ flex: "1", minWidth: "150px" }}>
          <label>Search Name</label>
          <input className="input-field" placeholder="e.g. Morning Run" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
        </div>
        <div className="input-group" style={{ flex: "1", minWidth: "130px" }}>
          <label>Category</label>
          <select className="input-field" value={search.category} onChange={e => setSearch({ ...search, category: e.target.value })}>
            <option value="">All</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="input-group" style={{ flex: "1", minWidth: "130px" }}>
          <label>Date</label>
          <input className="input-field" type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-teal" onClick={fetchWorkouts}>🔍 Search</button>
          <button className="btn btn-secondary" onClick={() => { setSearch({ name: "", category: "", date: "" }); setTimeout(fetchWorkouts, 0); }}>✕</button>
        </div>
      </div>

      {/* Workout Cards */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : workouts.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏋️</div>
          <h3>No workouts found</h3>
          <p style={{ fontSize: "14px" }}>Log your first workout to get started!</p>
          <button className="btn btn-primary" style={{ marginTop: "12px" }} onClick={openAdd}>➕ Add First Workout</button>
        </div>
      ) : (
        <div className="cards-grid">
          {workouts.map(w => (
            <div key={w._id} className="glass-card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "6px" }}>{w.workoutName}</h3>
                  <span className={`badge badge-${getBadgeClass(w.category)}`}>{w.category}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(w)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(w._id)}>🗑️</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { icon: "⏱", label: "Duration", value: `${w.duration} min` },
                  { icon: "🔥", label: "Calories", value: `${w.caloriesBurned} kcal` },
                  { icon: "📅", label: "Date", value: new Date(w.workoutDate).toLocaleDateString() },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "18px" }}>{icon}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, marginTop: "2px" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? "✏️ Edit Workout" : "➕ Add Workout"}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="input-group">
                <label>Workout Name</label>
                <input className="input-field" placeholder="e.g. Morning Run" value={form.workoutName} onChange={e => setForm({ ...form, workoutName: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="input-group">
                  <label>Duration (min)</label>
                  <input className="input-field" type="number" min="1" placeholder="30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Calories Burned</label>
                  <input className="input-field" type="number" min="0" placeholder="250" value={form.caloriesBurned} onChange={e => setForm({ ...form, caloriesBurned: e.target.value })} required />
                </div>
              </div>
              <div className="input-group">
                <label>Workout Date</label>
                <input className="input-field" type="date" value={form.workoutDate} onChange={e => setForm({ ...form, workoutDate: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? "Saving..." : "Save Workout"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
