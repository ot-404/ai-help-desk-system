import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTickets from "./pages/user/MyTickets";
import NewTicket from "./pages/user/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import AgentQueue from "./pages/agent/AgentQueue";
import Dashboard from "./pages/admin/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel";
import KnowledgeBase from "./pages/admin/KnowledgeBase";

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "user") return <Navigate to="/my-tickets" replace />;
  return <Navigate to="/agent" replace />;
}

/** Three-column Quora-style layout */
function Layout({ children, wide }) {
  const { user } = useAuth();
  if (!user) return children;
  return (
    <>
      <NavBar />
      <div style={s.page}>
        <div style={{ ...s.container, maxWidth: wide ? 1200 : 1100 }}>
          <Sidebar />
          <main style={s.main}>{children}</main>
          {!wide && <RightPanel />}
        </div>
      </div>
    </>
  );
}

const s = {
  page: { paddingTop: 66, minHeight: "100vh", background: "#f2f2f0" },
  container: { margin: "0 auto", display: "flex", gap: 24, padding: "0 16px", alignItems: "flex-start" },
  main: { flex: 1, minWidth: 0 },
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><Layout><RoleRedirect /></Layout></PrivateRoute>} />

          <Route path="/my-tickets" element={<PrivateRoute roles={["user"]}><Layout><MyTickets /></Layout></PrivateRoute>} />
          <Route path="/new-ticket" element={<PrivateRoute roles={["user"]}><Layout><NewTicket /></Layout></PrivateRoute>} />
          <Route path="/ticket/:id" element={<PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>} />

          <Route path="/agent"    element={<PrivateRoute roles={["agent","admin"]}><Layout><AgentQueue /></Layout></PrivateRoute>} />
          <Route path="/admin/kb" element={<PrivateRoute roles={["agent","admin"]}><Layout><KnowledgeBase /></Layout></PrivateRoute>} />

          <Route path="/admin"       element={<PrivateRoute roles={["admin"]}><Layout wide><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><Layout><AdminPanel /></Layout></PrivateRoute>} />

          <Route path="*" element={<Layout><div style={{ textAlign:"center", marginTop:80, color:"#939598" }}><h2>404 — Page not found</h2></div></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
