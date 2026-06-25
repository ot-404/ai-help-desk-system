import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TasksView from "./pages/TasksView";

function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/app/today" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route
        path="/app"
        element={<ProtectedRoute><AppLayout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="/app/today" replace />} />
        <Route path="today" element={<TasksView view="today" />} />
        <Route path="upcoming" element={<TasksView view="upcoming" />} />
        <Route path="all" element={<TasksView view="all" />} />
        <Route path="inbox" element={<TasksView view="inbox" />} />
        <Route path="completed" element={<TasksView view="completed" />} />
        <Route path="list/:id" element={<TasksView view="list" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
