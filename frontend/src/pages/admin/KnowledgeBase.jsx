import { useEffect, useRef, useState } from "react";
import api from "../../api/client";
import { C } from "../../theme";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef();

  async function load(q = "") {
    const url = q ? `/kb/search?q=${encodeURIComponent(q)}` : "/kb/";
    const { data } = await api.get(url);
    setArticles(Array.isArray(data) ? data : data.results ?? []);
  }

  useEffect(() => { load(); }, []);

  function startNew() { setEditing("new"); setForm({ title: "", content: "", category: "", tags: "" }); }
  function startEdit(a) { setEditing(a.id); setForm({ title: a.title, content: a.content, category: a.category || "", tags: (a.tags || []).join(", ") }); }
  function cancel() { setEditing(null); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { title: form.title, content: form.content, category: form.category, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (editing === "new") await api.post("/kb/", payload);
      else await api.put(`/kb/${editing}`, payload);
      setEditing(null);
      load(search);
    } finally { setSaving(false); }
  }

  async function deleteArticle(id) {
    if (!confirm("Delete this article?")) return;
    await api.delete(`/kb/${id}`);
    load(search);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/kb/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadMsg(`✓ "${data.title}" added`);
      load(search);
    } catch (err) {
      setUploadMsg(`Error: ${err.response?.data?.error || "upload failed"}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.h1}>Knowledge Base</h1>
        <div style={s.headerBtns}>
          <label style={s.uploadBtn}>
            {uploading ? "Uploading…" : "Upload File"}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          </label>
          <button onClick={startNew} style={s.addBtn}>+ Add Article</button>
        </div>
      </div>

      {uploadMsg && <div style={{ ...s.uploadMsg, color: uploadMsg.startsWith("✓") ? "#1a7f45" : "#c53030" }}>{uploadMsg}</div>}

      <form onSubmit={(e) => { e.preventDefault(); load(search); }} style={s.searchRow}>
        <input style={s.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" />
        <button style={s.searchBtn} type="submit">Search</button>
        {search && <button type="button" style={s.clearBtn} onClick={() => { setSearch(""); load(); }}>Clear</button>}
      </form>

      {editing && (
        <div style={s.formCard}>
          <div style={s.formTitle}>{editing === "new" ? "New Article" : "Edit Article"}</div>
          <form onSubmit={save}>
            <label style={s.label}>Title</label>
            <input style={s.input} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            <label style={s.label}>Category</label>
            <input style={s.input} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Blog, Tutorial, Technical" />
            <label style={s.label}>Tags (comma separated)</label>
            <input style={s.input} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="javascript, react, devops" />
            <label style={s.label}>Content</label>
            <textarea style={{ ...s.input, height: 160, resize: "vertical" }} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required />
            <div style={s.formBtns}>
              <button style={s.saveBtn} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              <button type="button" onClick={cancel} style={s.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}><th style={s.th}>Title</th><th style={s.th}>Category</th><th style={s.th}>Actions</th></tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} style={s.tr}>
                <td style={s.td}>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  <div style={s.preview}>{a.content?.slice(0, 100)}…</div>
                </td>
                <td style={s.td}>{a.category && <span style={s.cat}>{a.category}</span>}</td>
                <td style={s.td}>
                  <button onClick={() => startEdit(a)} style={s.editBtn}>Edit</button>
                  <button onClick={() => deleteArticle(a.id)} style={s.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && <tr><td colSpan={3} style={s.center}>No articles found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: 14 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  h1: { fontSize: 22, fontWeight: 800, margin: 0, color: C.text },
  headerBtns: { display: "flex", gap: 10 },
  uploadBtn: { background: "#fff", color: C.primary, border: "1px solid " + C.border, borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 600 },
  addBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 700 },
  uploadMsg: { borderRadius: 6, padding: "10px 14px", fontSize: 14, fontWeight: 600, background: "#fff", border: "1px solid " + C.border },
  searchRow: { display: "flex", gap: 8 },
  searchInput: { flex: 1, border: "1px solid " + C.border, borderRadius: 8, padding: "9px 14px", fontSize: 14, background: "#fff" },
  searchBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 700 },
  clearBtn: { background: "#fff", border: "1px solid " + C.border, borderRadius: 8, padding: "9px 14px", fontSize: 14 },
  formCard: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: 20 },
  formTitle: { fontWeight: 700, marginBottom: 16, fontSize: 16, color: C.text },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 },
  input: { width: "100%", border: "1px solid " + C.border, borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit", color: C.text },
  formBtns: { display: "flex", gap: 10 },
  saveBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 700 },
  cancelBtn: { background: "#fff", border: "1px solid " + C.border, borderRadius: 8, padding: "10px 18px", fontSize: 14 },
  tableWrap: { background: C.surface, border: "1px solid " + C.border, borderRadius: 8, overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: C.bg },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".5px" },
  tr: { borderTop: "1px solid " + C.bg },
  td: { padding: "12px 14px", fontSize: 14, verticalAlign: "top" },
  preview: { fontSize: 12, color: C.light, marginTop: 4 },
  cat: { fontSize: 11, fontWeight: 700, color: C.tagText, background: C.tagBg, padding: "2px 8px", borderRadius: 4 },
  center: { padding: "32px 0", textAlign: "center", color: C.light },
  editBtn: { background: C.bg, border: "1px solid " + C.border, borderRadius: 6, padding: "6px 12px", fontSize: 13, marginRight: 6 },
  deleteBtn: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "6px 12px", fontSize: 13, color: "#dc2626" },
};
