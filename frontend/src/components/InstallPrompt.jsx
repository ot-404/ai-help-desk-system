import { useState, useEffect } from "react";
import { C } from "../theme";

const DISMISS_KEY = "hds_install_dismissed";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Android / desktop Chromium fire this when the app is installable.
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS Safari has no beforeinstallprompt — show manual instructions instead.
    if (isIos()) setShow(true);

    const onInstalled = () => setShow(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    setIosHint(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
  };

  const install = async () => {
    if (isIos()) { setIosHint((v) => !v); return; }
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") {
      setShow(false);
    } else {
      setShow(false);
      try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    }
  };

  return (
    <div style={s.bar}>
      <div style={s.left}>
        <img src="/icon-192.png" alt="" width="34" height="34" style={s.icon} />
        <div style={s.text}>
          <div style={s.title}>Install Askora</div>
          <div style={s.sub}>
            {iosHint
              ? "Tap the Share icon, then “Add to Home Screen.”"
              : "Add the app to your home screen for quick access."}
          </div>
        </div>
      </div>
      <div style={s.actions}>
        <button style={s.installBtn} onClick={install}>{isIos() ? "How?" : "Install"}</button>
        <button style={s.dismissBtn} onClick={dismiss} aria-label="Dismiss">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

const s = {
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
    padding: "10px 12px", marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  left: { display: "flex", alignItems: "center", gap: 11, minWidth: 0 },
  icon: { borderRadius: 8, flexShrink: 0 },
  text: { minWidth: 0 },
  title: { fontSize: 14, fontWeight: 700, color: C.text },
  sub: { fontSize: 12.5, color: C.muted, lineHeight: 1.35 },
  actions: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
  installBtn: { background: C.gradient, color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  dismissBtn: { background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 6, display: "flex", borderRadius: 8 },
};
