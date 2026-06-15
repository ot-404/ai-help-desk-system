import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login");
  }

  const links = {
    user: [{ to: "/my-tickets", label: "My Tickets" }, { to: "/new-ticket", label: "New Ticket" }],
    agent: [{ to: "/agent", label: "Queue" }],
    admin: [{ to: "/agent", label: "Queue" }, { to: "/admin", label: "Dashboard" }, { to: "/admin/users", label: "Users" }, { to: "/admin/kb", label: "Knowledge Base" }],
  };

  const roleLinks = links[user?.role] ?? [];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>AI</span>
        <span style={styles.name}>Help Desk</span>
      </div>
      <div style={styles.links}>
        {roleLinks.map((l) => (
          <Link key={l.to} to={l.to} style={styles.link}>{l.label}</Link>
        ))}
      </div>
      <div style={styles.right}>
        <span style={styles.badge}>{user?.role}</span>
        <span style={styles.email}>{user?.email}</span>
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", alignItems: "center", gap: 24, padding: "0 28px", height: 56, background: "#1f2a37", color: "#fff" },
  brand: { display: "flex", alignItems: "center", gap: 10, marginRight: 16 },
  logo: { background: "#16c784", color: "#fff", fontWeight: 800, fontSize: 13, padding: "3px 8px", borderRadius: 6 },
  name: { fontWeight: 700, fontSize: 16 },
  links: { display: "flex", gap: 4, flex: 1 },
  link: { color: "#a0aec0", textDecoration: "none", padding: "6px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500 },
  right: { display: "flex", alignItems: "center", gap: 12 },
  badge: { background: "#2d3748", color: "#16c784", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" },
  email: { color: "#a0aec0", fontSize: 13 },
  btn: { background: "transparent", color: "#a0aec0", border: "1px solid #4a5568", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 },
};
