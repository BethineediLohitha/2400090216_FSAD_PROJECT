import { useState, useEffect } from "react";
import { Users, FileText, Clock, DollarSign, ShieldCheck, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";

function StatCard({ label, value, color, Icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", flex: 1, minWidth: 180, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 13, color: "#71717a", fontWeight: 500 }}>{label}</span>
        <div style={{ background: color + "20", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#18181b", marginTop: 12 }}>{value}</div>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    ROLE_ADMIN:    { bg: "#fee2e2", color: "#dc2626" },
    ROLE_LENDER:   { bg: "#dcfce7", color: "#15803d" },
    ROLE_BORROWER: { bg: "#dbeafe", color: "#1d4ed8" },
    ROLE_ANALYST:  { bg: "#f3e8ff", color: "#7c3aed" },
  };
  const s = colors[role] || { bg: "#f4f4f5", color: "#52525b" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
      {role?.replace("ROLE_", "")}
    </span>
  );
}

export default function AdminPanel({ username, onLogout, onChangeRole }) {
  const [view, setView] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    api.get("/users").then(r => setUsers(r.data)).catch(console.error);
    api.get("/loans/applications").then(r => setLoans(r.data)).catch(console.error);
  }, []);

  const totalUsers   = users.length;
  const activeLoans  = loans.filter(l => l.status === "APPROVED").length;
  const pendingCount = loans.filter(l => l.status === "PENDING").length;
  const disbursed    = loans.filter(l => l.status === "APPROVED").reduce((s, l) => s + l.amount, 0);

  const statusBadge = (s) => {
    const map = { APPROVED: ["#dcfce7","#15803d"], PENDING: ["#fef9c3","#a16207"], REJECTED: ["#fee2e2","#dc2626"] };
    const [bg, color] = map[s] || ["#f4f4f5","#52525b"];
    return <span style={{ background: bg, color, padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>{s}</span>;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Navbar onLogout={onLogout} onChangeRole={onChangeRole} />
      <div style={{ padding: "32px 36px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#71717a" }}>Welcome back,</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#18181b" }}>{username} <span style={{ fontSize: 14, fontWeight: 500, color: "#ef4444", background: "#fee2e2", padding: "2px 10px", borderRadius: 20 }}>Admin</span></h1>
        </div>

        {view === "dashboard" && (
          <>
            <div style={{ display: "flex", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard label="Total Users"       value={totalUsers}                       color="#6366f1" Icon={Users} />
              <StatCard label="Approved Loans"    value={activeLoans}                      color="#22c55e" Icon={FileText} />
              <StatCard label="Pending Approvals" value={pendingCount}                     color="#f97316" Icon={Clock} />
              <StatCard label="Total Disbursed"   value={`$${disbursed.toLocaleString()}`} color="#a855f7" Icon={DollarSign} />
            </div>

            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 1, minWidth: 280, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: 16 }}>Quick Actions</h3>
                {[
                  { label: "Manage Users", icon: <Users size={16} />, action: () => setView("users"), color: "#6366f1" },
                  { label: "View All Loans", icon: <FileText size={16} />, action: () => setView("loans"), color: "#22c55e" },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#f9fafb", border: "1px solid #e4e4e7", borderRadius: 12, padding: "14px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 12, color: "#18181b" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10, color: btn.color }}>{btn.icon} {btn.label}</span>
                    <ChevronRight size={16} color="#a1a1aa" />
                  </button>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 2, minWidth: 300, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <ShieldCheck size={18} color="#6366f1" />
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Recent Users</h3>
                </div>
                {users.slice(0, 5).map(u => (
                  <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f4f4f5" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{u.username}</div>
                      <div style={{ fontSize: 12, color: "#71717a" }}>{u.email}</div>
                    </div>
                    <RoleBadge role={u.role} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "users" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>All Users</h2>
              <button onClick={() => setView("dashboard")} style={{ background: "#f4f4f5", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Back</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["#","Username","Email","Role"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "#71717a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f4f4f5" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#a1a1aa" }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600 }}>{u.username}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#52525b" }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}><RoleBadge role={u.role} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "loans" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>All Loan Applications</h2>
              <button onClick={() => setView("dashboard")} style={{ background: "#f4f4f5", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Back</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["ID","Borrower","Lender","Amount","Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "#71717a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id} style={{ borderBottom: "1px solid #f4f4f5" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 13, color: "#6366f1" }}>#{l.id}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600 }}>{l.borrower.username}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#52525b" }}>{l.loanOffer.lender.username}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600 }}>${l.amount.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px" }}>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
