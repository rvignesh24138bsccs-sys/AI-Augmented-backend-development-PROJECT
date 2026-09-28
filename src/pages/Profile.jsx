import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const GOALS = ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "Overall Fitness"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const openEdit = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || "",
      fitnessGoal: user?.fitnessGoal || "Overall Fitness",
      experienceLevel: user?.experienceLevel || "Beginner",
      password: "",
    });
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {};
      if (form.name && form.name !== user.name) payload.name = form.name;
      if (form.email && form.email !== user.email) payload.email = form.email;
      if (form.age && Number(form.age) !== user.age) payload.age = Number(form.age);
      if (form.fitnessGoal && form.fitnessGoal !== user.fitnessGoal) payload.fitnessGoal = form.fitnessGoal;
      if (form.experienceLevel && form.experienceLevel !== user.experienceLevel) payload.experienceLevel = form.experienceLevel;
      if (form.password) payload.password = form.password;

      if (Object.keys(payload).length === 0) {
        setError("No changes detected.");
        setLoading(false);
        return;
      }

      await updateProfile(payload);
      setSuccess("Profile updated successfully! ✅");
      setEditing(false);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "680px" }}>
      <div className="page-header">
        <h1>👤 My <span className="gradient-text">Profile</span></h1>
        {!editing && (
          <button className="btn btn-teal" onClick={openEdit}>✏️ Edit Profile</button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Avatar & Name Banner */}
      <div className="glass-card" style={{ padding: "28px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "var(--gradient)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "34px", fontWeight: 800, color: "#fff",
          flexShrink: 0,
        }}>
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>{user?.name || "Fitness Athlete"}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "2px" }}>{user?.email}</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
            <span className="badge badge-default">Active Member</span>
            <span className="badge badge-cardio">{user?.fitnessGoal || "Overall Fitness"}</span>
            <span className="badge badge-strength">{user?.experienceLevel || "Beginner"}</span>
          </div>
        </div>
      </div>

      {/* View Mode */}
      {!editing ? (
        <div className="glass-card" style={{ padding: "28px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>Account Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Full Name", value: user?.name || "—" },
              { label: "Email Address", value: user?.email || "—" },
              { label: "Age", value: user?.age ? `${user.age} years` : "—" },
              { label: "Fitness Goal", value: user?.fitnessGoal || "—" },
              { label: "Experience Level", value: user?.experienceLevel || "—" },
              { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-danger" onClick={logout}>🚪 Sign Out</button>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="glass-card" style={{ padding: "28px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>✏️ Edit Your Profile</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="input-group">
              <label>Full Name</label>
              <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input className="input-field" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input className="input-field" name="age" type="number" min="10" max="120" value={form.age} onChange={handleChange} placeholder="e.g. 25" />
            </div>
            <div className="input-group">
              <label>Fitness Goal</label>
              <select className="input-field" name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Experience Level</label>
              <select className="input-field" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>New Password (leave blank to keep current)</label>
              <input className="input-field" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
