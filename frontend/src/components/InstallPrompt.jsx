import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

// Shows a dismissible "Install Lumo" banner when the browser fires
// beforeinstallprompt (Chrome/Edge/Android). No-op elsewhere.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    const onInstalled = () => setShow(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!show || !deferred) return null;

  async function install() {
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[20rem] items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-xl shadow-black/40 animate-fade-in">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Download size={18} />
      </div>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-ink">Install Lumo</p>
        <p className="text-xs text-muted">Add it to your device for quick access.</p>
      </div>
      <button onClick={install} className="btn-primary h-8 shrink-0 px-3 py-0 text-xs">Install</button>
      <button onClick={() => setShow(false)} aria-label="Dismiss" className="shrink-0 text-faint hover:text-ink">
        <X size={16} />
      </button>
    </div>
  );
}
