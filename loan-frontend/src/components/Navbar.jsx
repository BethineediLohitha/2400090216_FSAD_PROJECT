import { LogOut, RefreshCw } from "lucide-react";

export default function Navbar({ onChangeRole, onLogout }) {
  return (
    <div style={{
      background: "#18181b", height: 56, padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "#6366f1", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>L</span>
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>LoanManager</span>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onChangeRole} style={{
          background: "transparent", border: "1px solid #3f3f46",
          color: "#d4d4d8", borderRadius: 8, padding: "6px 16px",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <RefreshCw size={14} /> Change Role
        </button>
        <button onClick={onLogout} style={{
          background: "#ef4444", border: "none",
          color: "#fff", borderRadius: 8, padding: "6px 16px",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
}
