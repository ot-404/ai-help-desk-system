import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/").then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const ROLE_COLOR = { admin: "#e53e3e", agent: "#d69e2e", user: "#3182ce" };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Admin Panel</h2>
        <Link to="/admin" style={s.dashLink}>Dashboard</Link>
        <Link to="/admin/kb" style={s.dashLink}>Knowledge Base</Link>
      </div>

      <h3 style={s.sec}>Users</h3>
      {loading ? <div>Loading…</div> : (
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>ID</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Name</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={s.tr}>
                <td style={s.td}>{u.id}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{u.name}</td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: (ROLE_COLOR[u.role] || "#718096") + "22", color: ROLE_COLOR[u.role] || "#718096" }}>
                    {u.role}
                  </span>
                </td>
                <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, margin: 0, flex: 1 },
  dashLink: { background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 16px", textDecoration: "none", color: "#2d3748", fontSize: 14, fontWeight: 500 },
  sec: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  table: { width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)", borderCollapse: "collapse" },
  thead: { background: "#f7fafc" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#7a8794", textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid #f0f4f8" },
  td: { padding: "13px 16px", fontSize: 14 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 10 },
};
