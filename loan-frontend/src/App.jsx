import { useState, useEffect } from "react";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import LenderDashboard from "./pages/LenderDashboard";
import BorrowerDashboard from "./pages/BorrowerDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import RoleSelection from "./pages/RoleSelection";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [viewRoles, setViewRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState("borrower");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
    }
  }, [token, role, username]);

  const handleLoginSuccess = (data) => {
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const handleChangeRole = () => {
    handleLogout();
    setViewRoles(true);
  };

  if (!token) {
    if (viewRoles) {
      return <RoleSelection onSelect={(r) => {
        setSelectedRole(r);
        setViewRoles(false);
      }} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} defaultRole={selectedRole} />;
  }

  // Dashboard routing based on valid Spring Boot Roles
  if (role === "ROLE_ADMIN")
    return <AdminPanel username={username} onLogout={handleLogout} onChangeRole={handleChangeRole} />;

  if (role === "ROLE_LENDER")
    return <LenderDashboard username={username} onLogout={handleLogout} onChangeRole={handleChangeRole} />;

  if (role === "ROLE_BORROWER")
    return <BorrowerDashboard username={username} onLogout={handleLogout} onChangeRole={handleChangeRole} />;

  if (role === "ROLE_ANALYST")
    return <AnalystDashboard username={username} onLogout={handleLogout} onChangeRole={handleChangeRole} />;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Unknown Role: {role}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}