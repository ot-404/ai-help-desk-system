import { useEffect, useState } from "react";
import Modal from "./Modal";
import api, { apiError } from "../lib/api";
import { LIST_COLORS, LIST_ICON_NAMES, iconFor } from "../lib/icons";

export default function ListModal({ open, onClose, onSaved, existing }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(LIST_COLORS[0]);
  const [icon, setIcon] = useState("list");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(existing?.name || "");
      setColor(existing?.color || LIST_COLORS[0]);
      setIcon(existing?.icon || "list");
      setError("");
    }
  }, [open, existing]);

  async function save(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (existing) {
        await api.patch(`/lists/${existing.id}`, { name: name.trim(), color, icon });
      } else {
        await api.post("/lists/", { name: name.trim(), color, icon });
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(apiError(err, "Could not save list."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit list" : "New list"}>
      <form onSubmit={save} className="space-y-5 p-5">
        {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>}
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)}
                 placeholder="e.g. Work, Errands, Reading" autoFocus />
        </div>
        <div>
          <label className="label">Colour</label>
          <div className="flex flex-wrap gap-2">
            {LIST_COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-surface" : ""}`}
                      style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : "none" }} />
            ))}
          </div>
        </div>
        <div>
          <label className="label">Icon</label>
          <div className="flex flex-wrap gap-2">
            {LIST_ICON_NAMES.map((nm) => {
              const Ic = iconFor(nm);
              const active = icon === nm;
              return (
                <button key={nm} type="button" onClick={() => setIcon(nm)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                          active ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:bg-surface2"
                        }`}>
                  <Ic size={17} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : existing ? "Save" : "Create list"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
