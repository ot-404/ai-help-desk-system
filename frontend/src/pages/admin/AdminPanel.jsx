import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../theme";

const ROLE_COLOR = { admin: "#dc2626", agent: C.ai, user: C.primary };
const ROLES = ["user", "agent", "admin"];

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    api.get("/users/").then((r) => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  async function changeRole(userId, role) {
    setChanging(userId);
    try {
      const { data } = await api.patch(`/users/${userId}`, { role });
      setUsers((us) => us.map((u) => (u.id === userId ? data : u)));
    } catch { /* ignore */ } finally { setChanging(null); }
  }

  const shown = users.filter((u) => {
    const matchSearch = !search || (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div style={s.page}>
      <h1 style={s.h1}>User Management</h1>
      <p style={s.sub}>{users.length} registered user{users.length !== 1 ? "s" : ""}</p>

      <div style={s.controls}>
        <input style={s.search} placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div style={s.filters}>
          {["all", ...ROLES].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{ ...s.filter, ...(roleFilter === r ? s.filterActive : {}) }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>User</th><th style={s.th}>Email</th><th style={s.th}>Role</th><th style={s.th}>Joined</th><th style={s.th}>Change</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={s.center}>Loading…</td></tr>}
            {!loading && shown.map((u) => {
              const rc = ROLE_COLOR[u.role] || C.light;
              return (
                <tr key={u.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.userCell}>
                      <span style={{ ...s.avatar, background: rc }}>{(u.name || u.email || "?")[0].toUpperCase()}</span>
                      <span style={{ fontWeight: 600 }}>{u.name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ ...s.td, color: C.muted }}>{u.email}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: rc + "22", color: rc }}>{u.role}</span></td>
                  <td style={{ ...s.td, color: C.light, fontSize: 13 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td style={s.td}>
                    {u.id === me.id ? <span style={s.self}>you</span> : (
                      <select style={s.select} value={u.role} disabled={changing === u.id} onChange={(e) => changeRole(u.id, e.target.value)}>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && shown.length === 0 && <tr><td colSpan={5} style={s.center}>No users match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  h1: { fontSize: 22, fontWeight: 800, color: C.text, margin: 0 },
  sub: { fontSize: 14, color: C.muted, margin: "-8px 0 0" },
  controls: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
  search: { flex: 1, minWidth: 200, height: 40, border: "1px solid " + C.border, borderRadius: 8, padding: "0 14px", fontSize: 14, background: "#fff" },
  filters: { display: "flex", gap: 6 },
  filter: { background: C.surface, border: "1px solid " + C.border, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: C.muted, textTransform: "capitalize" },
  filterActive: { background: C.primary, color: "#fff", borderColor: C.primary },
  tableWrap: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: C.bg },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid " + C.bg },
  td: { padding: "12px 14px", fontSize: 14 },
  center: { padding: "32px 0", textAlign: "center", color: C.light },
  userCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" },
  self: { fontSize: 12, color: C.light, fontStyle: "italic" },
  select: { border: "1px solid " + C.border, borderRadius: 6, padding: "5px 10px", fontSize: 13, background: "#fff" },
};
