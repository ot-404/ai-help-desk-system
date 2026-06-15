import { useEffect, useRef, useState } from "react";
import api from "../../api/client";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
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

  async function deleteArticle(id) {
    if (!confirm("Delete this article?")) return;
    await api.delete(`/kb/${id}`);
    load(search);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/kb/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadMsg(`✓ "${data.title}" added to knowledge base`);
      load(search);
    } catch (err) {
      setUploadMsg(`Error: ${err.response?.data?.error || "upload failed"}`);
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    load(search);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Knowledge Base</h2>
        <div style={s.headerBtns}>
          <label style={s.uploadBtn}>
            {uploading ? "Uploading…" : "Upload File"}
            <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          </label>
          <button onClick={startNew} style={s.newBtn}>+ New Article</button>
        </div>
      </div>

      {uploadMsg && (
        <div style={{ ...s.uploadMsg, color: uploadMsg.startsWith("✓") ? "#16c784" : "#c53030", background: uploadMsg.startsWith("✓") ? "#f0fff4" : "#fff5f5" }}>
          {uploadMsg}
        </div>
      )}

      <div style={s.uploadHint}>
        Supported file types: <b>PDF</b>, <b>DOCX</b>, <b>TXT</b> — content is extracted and saved as a KB article automatically.
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
            <input style={s.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. billing, account, security…" />
            <label style={s.label}>Content</label>
            <textarea style={{ ...s.input, height: 160, resize: "vertical" }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
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
              <div style={s.artContent}>{a.content?.slice(0, 180)}{a.content?.length > 180 ? "…" : ""}</div>
            </div>
            <div style={s.artActions}>
              <button onClick={() => startEdit(a)} style={s.editBtn}>Edit</button>
              <button onClick={() => deleteArticle(a.id)} style={s.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
        {articles.length === 0 && <div style={s.empty}>No articles found. Add one or upload a file above.</div>}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 16 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, margin: 0, color: "#282829" },
  headerBtns: { display: "flex", gap: 10 },
  uploadBtn: { background: "#f0fdf8", color: "#16c784", border: "1px solid #c6f6d5", borderRadius: 20, padding: "8px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  newBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 20, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  uploadMsg: { borderRadius: 6, padding: "10px 14px", marginBottom: 12, fontSize: 14, fontWeight: 500 },
  uploadHint: { fontSize: 12, color: "#939598", marginBottom: 16 },
  searchRow: { display: "flex", gap: 8, marginBottom: 16 },
  searchInput: { flex: 1, border: "1px solid #e8e8e8", borderRadius: 20, padding: "9px 16px", fontSize: 14, outline: "none", background: "#f2f2f0" },
  searchBtn: { background: "#282829", color: "#fff", border: "none", borderRadius: 20, padding: "9px 18px", cursor: "pointer", fontSize: 14 },
  clearBtn: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 20, padding: "9px 14px", cursor: "pointer", fontSize: 14 },
  formCard: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "20px 24px", marginBottom: 16 },
  formTitle: { fontWeight: 700, marginBottom: 16, fontSize: 16, color: "#282829" },
  label: { display: "block", fontSize: 14, fontWeight: 600, color: "#282829", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #ccc", borderRadius: 4, padding: "10px 12px", fontSize: 14, marginBottom: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#282829" },
  formBtns: { display: "flex", gap: 10 },
  saveBtn: { background: "#16c784", color: "#fff", border: "none", borderRadius: 20, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 20, padding: "10px 18px", fontSize: 14, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  article: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  artLeft: { flex: 1 },
  cat: { fontSize: 11, fontWeight: 700, color: "#16c784", background: "#f0fdf8", padding: "2px 8px", borderRadius: 6, textTransform: "uppercase", display: "inline-block", marginBottom: 6 },
  artTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4, color: "#282829" },
  artContent: { fontSize: 13, color: "#939598", lineHeight: 1.5 },
  artActions: { display: "flex", flexDirection: "column", gap: 6, marginLeft: 16, flexShrink: 0 },
  editBtn: { background: "#f7f7f5", border: "1px solid #e8e8e8", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
  deleteBtn: { background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#ef4444" },
  empty: { color: "#939598", textAlign: "center", marginTop: 32 },
};
