import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChat from "./components/AIChat";
import InstallPrompt from "./components/InstallPrompt";
import { useIsMobile } from "./hooks/useIsMobile";
import { C } from "./theme";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import Popular from "./pages/Popular";
import Profile from "./pages/Profile";

function HomeOrRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin" || user?.role === "agent") return <StaffHome />;
  if (user?.role === "user") return <UserHome />;
  return <Home />;
}

function RightSummary() {
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16 };
  return (
    <div style={{ width: 300, flexShrink: 0 }}>
      {/* About card */}
      <div style={{ ...card, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: C.text }}>Askora</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>Your knowledge hub for everything — ask any question, get instant AI answers, and connect with others.</div>
        <Link to="/new-question" style={{ display: "block", textAlign: "center", background: C.gradient, color: "#fff", borderRadius: 10, padding: "9px 0", textDecoration: "none", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Create Post</Link>
        <Link to="/ask" style={{ display: "block", textAlign: "center", border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "9px 0", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Ask AI</Link>
      </div>

      {/* Community Rules card */}
      <div style={{ ...card, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Community Guidelines</div>
        {["Be respectful and kind to everyone","All topics welcome — tech, education, health, life and more","No spam or misleading content","Share knowledge and personal experience","Credit sources and original authors"].map((r, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, padding: "7px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", color: C.text, lineHeight: 1.45 }}>
            <span style={{ fontWeight: 700, color: C.primary, flexShrink: 0 }}>{i+1}</span>{r}
          </div>
        ))}
      </div>

      {/* Topics card */}
      <div style={{ ...card, padding: 16, marginBottom: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Popular Tags</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {["mathematics","health","history","science","english","cooking","finance","geography","careers","fitness","music","law"].map(t => (
            <Link key={t} to={`/faq?topic=${encodeURIComponent(t)}`} style={{ background: C.tag, color: C.tagText, border: `1px solid ${C.tagBorder}`, borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 500, cursor: "pointer", textDecoration: "none" }}>#{t}</Link>
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
      <div style={{ background: C.bg, minHeight: "100vh", paddingTop: 52, paddingBottom: isMobile ? 80 : 0 }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          display: "flex", gap: 20,
          padding: isMobile ? "14px 0" : "24px 16px",
          alignItems: "flex-start",
        }}>
          {!isMobile && <Sidebar />}
          <main style={{
            flex: 1, minWidth: 0,
            padding: isMobile ? "0 8px" : 0,
          }}>
            <InstallPrompt />
            {children}
          </main>
          {!isMobile && <RightSummary />}
        </div>
      </div>
      {isMobile && <BottomNav />}
      <AIChat />
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Public pages — shell visible, no login required */}
          <Route path="/"    element={<Layout><HomeOrRedirect /></Layout>} />
          <Route path="/help" element={<PrivateRoute roles={["agent","admin"]}><Layout><PublicHelp /></Layout></PrivateRoute>} />
          <Route path="/ask"  element={<Layout><AskAI /></Layout>} />
          <Route path="/faq"  element={<Layout><FAQ /></Layout>} />
          <Route path="/popular" element={<Layout><Popular /></Layout>} />

          {/* Any logged-in user */}
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

          {/* Any logged-in user can post; guests are sent to login */}
          <Route path="/my-questions" element={<PrivateRoute roles={["user"]}><Layout><MyTickets /></Layout></PrivateRoute>} />
          <Route path="/new-question" element={<PrivateRoute><Layout><NewTicket /></Layout></PrivateRoute>} />

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
