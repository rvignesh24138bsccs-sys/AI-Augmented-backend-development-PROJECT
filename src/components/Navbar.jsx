import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "⊞" },
    { path: "/workouts", label: "Workouts", icon: "💪" },
    { path: "/ai-recommendation", label: "AI Plan", icon: "🤖" },
    { path: "/ai-insights", label: "Insights", icon: "📊" },
  ];

  return (
    <>
      <nav ref={menuRef} style={{
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 20px"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 20,
              fontWeight: 900,
              background: "linear-gradient(135deg, #e94560, #00d4aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px"
            }}>
              ⚡ FitTrack AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-desktop" style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                  color: isActive(path) ? "#00d4aa" : "rgba(255,255,255,0.65)",
                  background: isActive(path) ? "rgba(0,212,170,0.12)" : "transparent",
                  border: isActive(path) ? "1px solid rgba(0,212,170,0.3)" : "1px solid transparent",
                }}
              >
                {icon} {label}
              </Link>
            ))}

            {/* Profile Avatar Pill */}
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                borderRadius: 20,
                marginLeft: 8,
                background: isActive("/profile") ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${isActive("/profile") ? "rgba(0,212,170,0.35)" : "rgba(255,255,255,0.1)"}`,
                transition: "all 0.2s"
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e94560, #9b2335)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0
              }}>
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                maxWidth: 90,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {user?.name?.split(" ")[0] || "Profile"}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 6,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: "rgba(233,69,96,0.12)",
                border: "1px solid rgba(233,69,96,0.3)",
                color: "#e94560",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: "none",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "var(--text-primary)",
              fontSize: 20,
              cursor: "pointer"
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            className="nav-mobile-dropdown"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 0 16px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              animation: "slideDown 0.25s ease"
            }}
          >
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "11px 16px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: isActive(path) ? "#00d4aa" : "var(--text-primary)",
                  background: isActive(path) ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive(path) ? "rgba(0,212,170,0.25)" : "transparent"}`
                }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span> {label}
              </Link>
            ))}

            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "11px 16px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: isActive("/profile") ? "#00d4aa" : "var(--text-primary)",
                background: isActive("/profile") ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive("/profile") ? "rgba(0,212,170,0.25)" : "transparent"}`
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e94560, #9b2335)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                color: "#fff"
              }}>
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <span>👤 {user?.name || "Profile"}</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                marginTop: 6,
                padding: "11px 16px",
                borderRadius: 10,
                background: "rgba(233,69,96,0.12)",
                border: "1px solid rgba(233,69,96,0.3)",
                color: "#e94560",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
