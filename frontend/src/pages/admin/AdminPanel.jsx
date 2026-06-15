import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const ROLE_COLOR = { admin: "#e53e3e", agent: "#805ad5", user: "#3182ce" };
const ROLES = ["user", "agent", "admin"];

const ROLE_DEFS = [
  {
    role: "admin",
    color: "#e53e3e",
    bg: "#fff5f5",
    border: "#fed7d7",
    icon: "🛡",
    title: "Administrator",
    summary: "Full system access. Manages users, monitors platform health, and oversees all support operations.",
    responsibilities: [
      "View and manage all tickets across the platform",
      "Change user roles (promote agents, demote users)",
      "Access the analytics dashboard and all metrics",
      "Create, edit, and delete Knowledge Base articles",
      "Upload documents to the Knowledge Base",
      "View real-time site visitor and user statistics",
      "Reply to any ticket thread",
    ],
    cannotDo: [
      "Cannot be seen or identified by users or agents in ticket threads",
    ],
  },
  {
    role: "agent",
    color: "#805ad5",
    bg: "#faf5ff",
    border: "#d6bcfa",
    icon: "🎧",
    title: "Support Agent",
    summary: "Front-line support staff. Handles incoming tickets, communicates with customers, and maintains the knowledge base.",
    responsibilities: [
      "View and manage all incoming support tickets",
      "Reply to tickets and update their status",
      "Change ticket priority and assignment",
      "Add and edit Knowledge Base articles",
      "Upload documents to the Knowledge Base",
      "Use AI-assisted resolution suggestions",
      "Trigger AI auto-replies on tickets",
    ],
    cannotDo: [
      "Cannot access the analytics dashboard",
      "Cannot view or change user roles",
      "Cannot be identified by role in customer-facing views",
    ],
  },
  {
    role: "user",
    color: "#3182ce",
    bg: "#ebf8ff",
    border: "#bee3f8",
    icon: "👤",
    title: "Customer / End User",
    summary: "External customers requesting support. Can only see and interact with their own tickets.",
    responsibilities: [
      "Submit new support tickets",
      "View and reply to their own tickets only",
      "Rate resolved tickets with a CSAT score (1–5 stars)",
      "Receive AI-generated initial responses",
    ],
    cannotDo: [
      "Cannot see other users' tickets",
      "Cannot change ticket status or priority",
      "Cannot identify support staff by name, email, or role — all replies appear as 'Support Team'",
      "Cannot access the Knowledge Base, Dashboard, or Admin Panel",
    ],
  },
];

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

      {/* Role Definitions */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Role Definitions & Responsibilities</div>
        <div style={s.rolesGrid}>
          {ROLE_DEFS.map(def => (
            <div key={def.role} style={{ ...s.roleCard, background: def.bg, border: `1.5px solid ${def.border}` }}>
              <div style={s.roleCardHeader}>
                <span style={s.roleIcon}>{def.icon}</span>
                <div>
                  <div style={{ ...s.roleTitle, color: def.color }}>{def.title}</div>
                  <span style={{ ...s.rolePill, background: def.color + "22", color: def.color }}>{def.role}</span>
                </div>
              </div>
              <p style={s.roleSummary}>{def.summary}</p>
              <div style={s.roleSection}>
                <div style={s.roleSectionLabel}>✓ Can do</div>
                <ul style={s.roleList}>
                  {def.responsibilities.map((r, i) => <li key={i} style={s.roleListItem}>{r}</li>)}
                </ul>
              </div>
              <div style={s.roleSection}>
                <div style={{ ...s.roleSectionLabel, color: "#c53030" }}>✕ Cannot do</div>
                <ul style={s.roleList}>
                  {def.cannotDo.map((r, i) => <li key={i} style={{ ...s.roleListItem, color: "#c53030" }}>{r}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
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
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  roleCard: { borderRadius: 12, padding: "18px 20px" },
  roleCardHeader: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  roleIcon: { fontSize: 24, lineHeight: 1, marginTop: 2 },
  roleTitle: { fontWeight: 700, fontSize: 15, marginBottom: 4 },
  rolePill: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: ".3px" },
  roleSummary: { fontSize: 13, color: "#4a5568", lineHeight: 1.55, margin: "0 0 14px" },
  roleSection: { marginBottom: 10 },
  roleSectionLabel: { fontSize: 11, fontWeight: 700, color: "#276749", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 4 },
  roleList: { margin: 0, padding: "0 0 0 16px" },
  roleListItem: { fontSize: 12, color: "#4a5568", lineHeight: 1.7 },
};
