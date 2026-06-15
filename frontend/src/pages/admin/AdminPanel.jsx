import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const ROLE_COLOR = { admin: "#e53e3e", agent: "#d69e2e", user: "#3182ce" };
const ROLES = ["user", "agent", "admin"];

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);

  useEffect(() => {
    api.get("/users/").then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  async function changeRole(userId, role) {
    setChanging(userId);
    try {
      const { data } = await api.patch(`/users/${userId}`, { role });
      setUsers(us => us.map(u => u.id === userId ? data : u));
    } catch {
      // ignore
    } finally { setChanging(null); }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Admin Panel</h2>
          <div style={s.sub}>{users.length} registered user{users.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Users</div>
        {loading ? (
          <div style={s.loading}>Loading…</div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>ID</th>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>Joined</th>
                  <th style={s.th}>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={s.tr}>
                    <td style={{ ...s.td, color: "#a0aec0", fontSize: 13 }}>{u.id}</td>
                    <td style={{ ...s.td, fontWeight: 500 }}>{u.name}</td>
                    <td style={{ ...s.td, color: "#4a5568" }}>{u.email}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: (ROLE_COLOR[u.role] || "#718096") + "22", color: ROLE_COLOR[u.role] || "#718096" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: "#7a8794", fontSize: 13 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={s.td}>
                      {u.id === me.id ? (
                        <span style={s.selfNote}>you</span>
                      ) : (
                        <select
                          style={s.roleSelect}
                          value={u.role}
                          disabled={changing === u.id}
                          onChange={e => changeRole(u.id, e.target.value)}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 960, margin: "32px auto", padding: "0 20px" },
  header: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  sub: { fontSize: 13, color: "#7a8794", marginTop: 2 },
  section: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: "#1f2a37", marginBottom: 16 },
  loading: { textAlign: "center", color: "#7a8794", padding: "40px 0", fontSize: 14 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f7fafc" },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#a0aec0", textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid #f0f4f8" },
  td: { padding: "13px 14px", fontSize: 14 },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  roleSelect: { border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 10px", fontSize: 13, background: "#f7fafc", cursor: "pointer", outline: "none" },
  selfNote: { fontSize: 12, color: "#a0aec0", fontStyle: "italic" },
};
