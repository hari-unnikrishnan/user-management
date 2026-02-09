import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path="/users/add"
        element={
          <PrivateRoute>
            <AddUser />
          </PrivateRoute>
        }
      />

      <Route
        path="/users/edit/:id"
        element={
          <PrivateRoute>
            <EditUser />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}
