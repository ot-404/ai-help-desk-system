import { useEffect, useState } from "react";
import api from "../../api/client";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [saving, setSaving] = useState(false);

  async function load(q = "") {
    const url = q ? `/kb/search?q=${encodeURIComponent(q)}` : "/kb/";
    const { data } = await api.get(url);
    setArticles(Array.isArray(data) ? data : data.results ?? []);
  }

  useEffect(() => { load(); }, []);

  function startNew() { setEditing("new"); setForm({ title: "", content: "", category: "" }); }
  function startEdit(a) { setEditing(a.id); setForm({ title: a.title, content: a.content, category: a.category || "" }); }
  function cancel() { setEditing(null); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await api.post("/kb/", form);
      } else {
        await api.put(`/kb/${editing}`, form);
      }
      setEditing(null);
      load(search);
    } finally { setSaving(false); }
  }

  async function handleSearch(e) {
    e.preventDefault();
    load(search);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Knowledge Base</h2>
        <button onClick={startNew} style={s.newBtn}>+ New Article</button>
      </div>

      <form onSubmit={handleSearch} style={s.searchRow}>
        <input style={s.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…" />
        <button style={s.searchBtn} type="submit">Search</button>
        {search && <button type="button" style={s.clearBtn} onClick={() => { setSearch(""); load(); }}>Clear</button>}
      </form>

      {editing && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editing === "new" ? "New Article" : "Edit Article"}</h3>
          <form onSubmit={save}>
            <label style={s.label}>Title</label>
            <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <label style={s.label}>Category</label>
            <input style={s.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. network, billing…" />
            <label style={s.label}>Content</label>
            <textarea style={{ ...s.input, height: 140, resize: "vertical" }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            <div style={s.formBtns}>
              <button style={s.saveBtn} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              <button type="button" onClick={cancel} style={s.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.list}>
        {articles.map(a => (
          <div key={a.id} style={s.article}>
            <div style={s.artLeft}>
              {a.category && <span style={s.cat}>{a.category}</span>}
              <div style={s.artTitle}>{a.title}</div>
              <div style={s.artContent}>{a.content?.slice(0, 160)}{a.content?.length > 160 ? "…" : ""}</div>
            </div>
            <button onClick={() => startEdit(a)} style={s.editBtn}>Edit</button>
          </div>
        ))}
        {articles.length === 0 && <div style={s.empty}>No articles found.</div>}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "32px auto", padding: "0 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 700, margin: 0 },
  newBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  searchRow: { display: "flex", gap: 8, marginBottom: 20 },
  searchInput: { flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none" },
  searchBtn: { background: "#2d3748", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 14 },
  clearBtn: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontSize: 14 },
  formCard: { background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,.07)" },
  formTitle: { fontWeight: 700, marginBottom: 16, fontSize: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  formBtns: { display: "flex", gap: 10 },
  saveBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 18px", fontSize: 14, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  article: { background: "#fff", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 1px 6px rgba(0,0,0,.05)" },
  artLeft: { flex: 1 },
  cat: { fontSize: 11, fontWeight: 700, color: "#3182ce", background: "#ebf8ff", padding: "2px 8px", borderRadius: 6, textTransform: "uppercase", display: "inline-block", marginBottom: 6 },
  artTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4 },
  artContent: { fontSize: 13, color: "#7a8794", lineHeight: 1.5 },
  editBtn: { background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", flexShrink: 0, marginLeft: 16 },
  empty: { color: "#7a8794", textAlign: "center", marginTop: 32 },
};
