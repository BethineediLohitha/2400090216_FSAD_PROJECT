import { Shield, Handshake, User, TrendingUp, ArrowRight } from "lucide-react";

const roles = [
  { key: "admin",    label: "Admin",            Icon: Shield,    color: "#ef4444", bg: "#fee2e2", desc: "Manage users, view all loans and platform analytics" },
  { key: "lender",   label: "Lender",           Icon: Handshake, color: "#22c55e", bg: "#dcfce7", desc: "Publish loan offers and approve borrower requests" },
  { key: "borrower", label: "Borrower",         Icon: User,      color: "#3b82f6", bg: "#dbeafe", desc: "Apply for loans and track your repayments" },
  { key: "analyst",  label: "Financial Analyst",Icon: TrendingUp, color: "#a855f7", bg: "#f3e8ff", desc: "Analyze loan data and generate financial reports" },
];

export default function RoleSelection({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", height: 56, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#6366f1", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>L</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>LoanManager Pro</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: "#fff", marginBottom: 8, textAlign: "center" }}>Select Your Role</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 48, textAlign: "center" }}>Choose how you want to access the platform</p>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1000 }}>
          {roles.map(r => (
            <div key={r.key}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; }}
              style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", width: 220, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", transition: "all 0.2s", cursor: "pointer" }}>
              <div style={{ background: r.bg, width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <r.Icon size={28} color={r.color} />
              </div>
              <h3 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 16, color: "#18181b" }}>{r.label}</h3>
              <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 24px", lineHeight: 1.6 }}>{r.desc}</p>
              <button onClick={() => onSelect(r.key)}
                style={{ background: r.color, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", width: "100%", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                Continue <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
