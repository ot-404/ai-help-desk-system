import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, CalendarCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import ListModal from "./ListModal";
import AIAssistant from "./AIAssistant";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [counts, setCounts] = useState({});
  const [mobileNav, setMobileNav] = useState(false);
  const [assistantSeed, setAssistantSeed] = useState(null); // {type, n} or null
  const [listModal, setListModal] = useState({ open: false, existing: null });

  const refreshMeta = useCallback(async () => {
    try {
      const [l, c] = await Promise.all([api.get("/lists/"), api.get("/tasks/counts")]);
      setLists(l.data);
      setCounts(c.data);
    } catch { /* handled by interceptor */ }
  }, []);

  useEffect(() => { refreshMeta(); }, [refreshMeta]);

  const openAssistant = useCallback((type = "chat") => {
    setAssistantSeed({ type, n: Date.now() });
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line lg:block">
        <Sidebar
          lists={lists} counts={counts} user={user}
          onNewList={() => setListModal({ open: true, existing: null })}
          onEditList={(l) => setListModal({ open: true, existing: l })}
          onLogout={handleLogout}
          onOpenAssistant={() => openAssistant("chat")}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-line bg-elevated animate-slide-in">
            <button onClick={() => setMobileNav(false)}
                    className="absolute right-3 top-4 z-10 text-faint hover:text-ink">
              <X size={20} />
            </button>
            <Sidebar
              lists={lists} counts={counts} user={user}
              onNavigate={() => setMobileNav(false)}
              onNewList={() => { setMobileNav(false); setListModal({ open: true, existing: null }); }}
              onEditList={(l) => { setMobileNav(false); setListModal({ open: true, existing: l }); }}
              onLogout={handleLogout}
              onOpenAssistant={() => { setMobileNav(false); openAssistant("chat"); }}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
          <button onClick={() => setMobileNav(true)} className="text-muted hover:text-ink lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button onClick={() => openAssistant("plan")} className="btn-ghost h-8 px-3 py-0 text-xs">
            <CalendarCheck size={15} /> <span className="hidden sm:inline">Plan my day</span>
          </button>
          <button onClick={() => openAssistant("chat")} className="btn-primary h-8 px-3 py-0 text-xs">
            <Sparkles size={15} /> <span className="hidden sm:inline">Assistant</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
            <Outlet context={{ lists, counts, refreshMeta, openAssistant }} />
          </div>
        </main>
      </div>

      <AIAssistant seed={assistantSeed} onClose={() => setAssistantSeed(null)} onMutated={refreshMeta} />

      <ListModal
        open={listModal.open}
        existing={listModal.existing}
        onClose={() => setListModal({ open: false, existing: null })}
        onSaved={refreshMeta}
      />
    </div>
  );
}
