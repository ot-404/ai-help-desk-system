import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function HomeOrRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin" || user?.role === "agent") return <StaffHome />;
  if (user?.role === "user") return <UserHome />;
  return <Home />;
}

/**
 * Single-column + BottomNav on mobile; left sidebar + main on desktop.
 * No right panel anywhere.
 */
function Layout({ children }) {
  const isMobile = useIsMobile();
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: 52, paddingBottom: isMobile ? 72 : 0, minHeight: "100vh", background: C.bg }}>
        <div style={{
          maxWidth: 1060, margin: "0 auto",
          display: "flex", gap: isMobile ? 0 : 24,
          padding: isMobile ? "16px 0" : "24px 16px",
          alignItems: "flex-start",
        }}>
          {!isMobile && <Sidebar />}
          <main style={{ flex: 1, minWidth: 0, padding: isMobile ? "0 16px" : 0 }}>
            {children}
          </main>
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
