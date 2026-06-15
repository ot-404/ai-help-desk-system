import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import BottomNav from "./components/BottomNav";
import PrivateRoute from "./components/PrivateRoute";
import { useIsMobile } from "./hooks/useIsMobile";
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

function HomeOrRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin" || user?.role === "agent") return <StaffHome />;
  if (user?.role === "user") return <UserHome />;
  return <Home />;
}

/**
 * Three-column shell on desktop, single-column + BottomNav on mobile.
 *  wide    → suppresses right panel (full-width content like Dashboard)
 *  noRight → suppresses right panel without widening main
 */
function Layout({ children, wide, noRight }) {
  const isMobile = useIsMobile();
  return (
    <>
      <NavBar />
      <div style={{ ...s.page, paddingBottom: isMobile ? 72 : 0 }}>
        <div style={{ ...s.container, maxWidth: wide ? 1260 : 1180, gap: isMobile ? 0 : 20, padding: isMobile ? "12px 0" : "20px 16px" }}>
          <Sidebar />
          <main style={{ ...s.main, padding: isMobile ? "0 12px" : 0 }}>{children}</main>
          {!wide && !noRight && <RightPanel />}
        </div>
      </div>
      {isMobile && <BottomNav />}
    </>
  );
}

const s = {
  page: { paddingTop: 56, minHeight: "100vh", background: "#f2f2f0" },
  container: { margin: "0 auto", display: "flex", alignItems: "flex-start" },
  main: { flex: 1, minWidth: 0 },
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone auth pages — no shell */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages — shell visible, no login required */}
          <Route path="/"    element={<Layout><HomeOrRedirect /></Layout>} />
          <Route path="/help" element={<Layout noRight><PublicHelp /></Layout>} />
          <Route path="/ask"  element={<Layout noRight><AskAI /></Layout>} />

          {/* User-only */}
          <Route path="/my-questions" element={<PrivateRoute roles={["user"]}><Layout><MyTickets /></Layout></PrivateRoute>} />
          <Route path="/new-question" element={<PrivateRoute roles={["user"]}><Layout noRight><NewTicket /></Layout></PrivateRoute>} />

          {/* Legacy redirects */}
          <Route path="/my-tickets"  element={<Navigate to="/my-questions" replace />} />
          <Route path="/new-ticket"  element={<Navigate to="/new-question" replace />} />

          {/* Any authenticated user */}
          <Route path="/question/:id" element={<PrivateRoute><Layout noRight><TicketDetail /></Layout></PrivateRoute>} />
          <Route path="/ticket/:id"   element={<PrivateRoute><Layout noRight><TicketDetail /></Layout></PrivateRoute>} />

          {/* Agent + Admin */}
          <Route path="/agent"    element={<PrivateRoute roles={["agent","admin"]}><Layout noRight><AgentQueue /></Layout></PrivateRoute>} />
          <Route path="/admin/kb" element={<PrivateRoute roles={["agent","admin"]}><Layout noRight><KnowledgeBase /></Layout></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin"       element={<PrivateRoute roles={["admin"]}><Layout wide><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><Layout noRight><AdminPanel /></Layout></PrivateRoute>} />

          <Route path="*" element={<Layout noRight><div style={{ textAlign:"center", marginTop:80, color:"#939598" }}><h2>404 — Page not found</h2></div></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
