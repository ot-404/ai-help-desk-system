import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublicHelp from "./pages/PublicHelp";
import UserHome from "./pages/UserHome";
import StaffHome from "./pages/StaffHome";
import MyTickets from "./pages/user/MyTickets";
import NewTicket from "./pages/user/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import AgentQueue from "./pages/agent/AgentQueue";
import Dashboard from "./pages/admin/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import KnowledgeBase from "./pages/admin/KnowledgeBase";
import AskAI from "./pages/AskAI";

/** Renders the right home experience based on who's viewing. */
function HomeOrRedirect() {
  const { user } = useAuth();
  if (user?.role === "admin" || user?.role === "agent") return <StaffHome />;
  if (user?.role === "user") return <UserHome />;
  return <Home />;
}

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div style={{ background: "#eef1f4", minHeight: "calc(100vh - 56px)", paddingBottom: 40 }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public pages */}
          <Route path="/" element={<Layout><HomeOrRedirect /></Layout>} />
          <Route path="/help" element={<Layout><PublicHelp /></Layout>} />
          <Route path="/ask" element={<Layout><AskAI /></Layout>} />

          {/* User-only pages */}
          <Route path="/my-tickets" element={<PrivateRoute roles={["user"]}><Layout><MyTickets /></Layout></PrivateRoute>} />
          <Route path="/new-ticket" element={<PrivateRoute roles={["user"]}><Layout><NewTicket /></Layout></PrivateRoute>} />

          {/* Any logged-in user */}
          <Route path="/ticket/:id" element={<PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>} />

          {/* Agent + Admin */}
          <Route path="/agent" element={<PrivateRoute roles={["agent","admin"]}><Layout><AgentQueue /></Layout></PrivateRoute>} />
          <Route path="/admin/kb" element={<PrivateRoute roles={["agent","admin"]}><Layout><KnowledgeBase /></Layout></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<PrivateRoute roles={["admin"]}><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><Layout><AdminPanel /></Layout></PrivateRoute>} />

          <Route path="*" element={<Layout><div style={{ textAlign: "center", marginTop: 80, color: "#7a8794" }}><h2>404 — Page not found</h2></div></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
