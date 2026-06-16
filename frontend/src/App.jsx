import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { useIsMobile } from "./hooks/useIsMobile";
import { C } from "./theme";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import StaffHome from "./pages/StaffHome";
import PublicHelp from "./pages/PublicHelp";
import AskAI from "./pages/AskAI";
import MyTickets from "./pages/user/MyTickets";
import NewTicket from "./pages/user/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import AgentQueue from "./pages/agent/AgentQueue";
import Dashboard from "./pages/admin/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import KnowledgeBase from "./pages/admin/KnowledgeBase";
import FAQ from "./pages/FAQ";

function HomeOrRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin" || user?.role === "agent") return <StaffHome />;
  if (user?.role === "user") return <UserHome />;
  return <Home />;
}

function RightSummary() {
  return (
    <div style={{ width: 312, flexShrink: 0 }}>
      {/* Create Post card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(to bottom, #46d160, #1a7f37)", height: 64 }} />
        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Home</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 12 }}>The front page of HD Systems — the tech knowledge hub.</div>
          <Link to="/new-question" style={{ display: "block", textAlign: "center", background: C.primary, color: "#fff", borderRadius: 20, padding: "6px 0", textDecoration: "none", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Create Post</Link>
          <Link to="/ask" style={{ display: "block", textAlign: "center", border: `1px solid ${C.primary}`, color: C.primary, borderRadius: 20, padding: "6px 0", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Ask AI</Link>
        </div>
      </div>

      {/* Community Rules card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 12, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 8 }}>HD Systems Rules</div>
        {["Be respectful and professional","Stay on-topic (tech, programming, IT)","No spam or self-promotion without value","Share knowledge, not just opinions","Credit sources and original authors"].map((r, i) => (
          <div key={i} style={{ fontSize: 14, padding: "4px 0", borderBottom: `1px solid ${C.divider}`, color: C.text }}>
            <span style={{ fontWeight: 700, color: C.primary }}>{i+1}. </span>{r}
          </div>
        ))}
      </div>

      {/* Topics card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Popular Topics</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["#javascript","#python","#devops","#kubernetes","#security","#rust","#react","#systemdesign","#linux","#cloud"].map(t => (
            <span key={t} style={{ background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`, borderRadius: 2, padding: "2px 8px", fontSize: 12, cursor: "pointer" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar + main + right summary on desktop; main + BottomNav on mobile.
 */
function Layout({ children }) {
  const isMobile = useIsMobile();
  return (
    <>
      <NavBar />
      <div style={{ background: C.bg, minHeight: "100vh", paddingTop: 48, paddingBottom: isMobile ? 72 : 0 }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", gap: 24,
          padding: isMobile ? "16px 0" : "20px 16px",
          alignItems: "flex-start",
        }}>
          {!isMobile && <Sidebar />}
          <main style={{
            flex: 1, minWidth: 0,
            padding: isMobile ? "0 8px" : 0,
          }}>
            {children}
          </main>
          {!isMobile && <RightSummary />}
        </div>
      </div>
      {isMobile && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone auth pages — no shell */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages — shell visible, no login required */}
          <Route path="/"    element={<Layout><HomeOrRedirect /></Layout>} />
          <Route path="/help" element={<Layout><PublicHelp /></Layout>} />
          <Route path="/ask"  element={<Layout><AskAI /></Layout>} />
          <Route path="/faq"  element={<Layout><FAQ /></Layout>} />

          {/* User-only */}
          <Route path="/my-questions" element={<PrivateRoute roles={["user"]}><Layout><MyTickets /></Layout></PrivateRoute>} />
          <Route path="/new-question" element={<PrivateRoute roles={["user"]}><Layout><NewTicket /></Layout></PrivateRoute>} />

          {/* Legacy redirects */}
          <Route path="/my-tickets"  element={<Navigate to="/my-questions" replace />} />
          <Route path="/new-ticket"  element={<Navigate to="/new-question" replace />} />

          {/* Any authenticated user */}
          <Route path="/question/:id" element={<PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>} />
          <Route path="/ticket/:id"   element={<PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>} />

          {/* Agent + Admin */}
          <Route path="/agent"    element={<PrivateRoute roles={["agent","admin"]}><Layout><AgentQueue /></Layout></PrivateRoute>} />
          <Route path="/admin/kb" element={<PrivateRoute roles={["agent","admin"]}><Layout><KnowledgeBase /></Layout></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin"       element={<PrivateRoute roles={["admin"]}><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><Layout><AdminPanel /></Layout></PrivateRoute>} />

          <Route path="*" element={<Layout><div style={{ textAlign:"center", marginTop:80, color:"#939598" }}><h2>404 — Page not found</h2></div></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}
