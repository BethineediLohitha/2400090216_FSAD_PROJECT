import { useState, useEffect } from "react";
import { FileText, DollarSign, Tag, CheckCircle, Clock, XCircle } from "lucide-react";
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

function Badge({ status }) {
  const map = {
    APPROVED: { bg: "#dcfce7", color: "#15803d", icon: <CheckCircle size={12} /> },
    PENDING:  { bg: "#fef9c3", color: "#a16207", icon: <Clock size={12} /> },
    REJECTED: { bg: "#fee2e2", color: "#dc2626", icon: <XCircle size={12} /> },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {s.icon} {status}
    </span>
  );
}

export default function BorrowerDashboard({ username, onLogout, onChangeRole }) {
  const [view, setView] = useState("dashboard");
  const [myApplications, setMyApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({ amount: "", offerId: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    try {
      const [appsRes, offersRes] = await Promise.all([
        api.get("/loans/applications/mine"),
        api.get("/loans/offers")
      ]);
      setMyApplications(appsRes.data);
      setOffers(offersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalAmt = myApplications.filter(a => a.status === "APPROVED").reduce((s, a) => s + a.amount, 0);

  const handleSubmit = async () => {
    if (!form.amount || !form.offerId) return setMsg("Please select an offer and enter amount");
    try {
      await api.post("/loans/applications", { offerId: parseInt(form.offerId), amount: Number(form.amount) });
      setForm({ amount: "", offerId: "" });
      setMsg("Application submitted successfully!");
      setView("dashboard");
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to apply for loan.");
    }
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e4e4e7", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb", marginTop: 6, marginBottom: 15 };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 16, color: "#71717a" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Navbar onLogout={onLogout} onChangeRole={onChangeRole} />
      <div style={{ padding: "32px 36px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#71717a" }}>Welcome back,</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#18181b" }}>{username} <span style={{ fontSize: 14, fontWeight: 500, color: "#6366f1", background: "#eef2ff", padding: "2px 10px", borderRadius: 20 }}>Borrower</span></h1>
        </div>

        {msg && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "12px 18px", borderRadius: 10, marginBottom: 20, fontSize: 14 }}>{msg}</div>}

        {view === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>My Dashboard</h2>
              <button onClick={() => { setMsg(""); setView("apply"); }} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                + Apply for Loan
              </button>
            </div>

            <div style={{ display: "flex", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
              <StatCard label="Total Applications" value={myApplications.length} color="#6366f1" Icon={FileText} />
              <StatCard label="Total Approved" value={`$${totalAmt.toLocaleString()}`} color="#22c55e" Icon={DollarSign} />
              <StatCard label="Available Offers" value={offers.length} color="#f97316" Icon={Tag} />
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: 16 }}>My Applications</h3>
              {myApplications.length === 0
                ? <div style={{ textAlign: "center", padding: "40px 0", color: "#a1a1aa" }}>
                    <FileText size={40} style={{ marginBottom: 10, opacity: 0.3 }} />
                    <p>No applications yet. Apply for a loan to get started.</p>
                  </div>
                : myApplications.map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f4f4f5" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>Offer #{l.loanOffer.id}</div>
                      <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>Amount: <strong>${l.amount.toLocaleString()}</strong></div>
                    </div>
                    <Badge status={l.status} />
                  </div>
                ))
              }
            </div>
          </>
        )}

        {view === "apply" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "36px 40px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 22 }}>Apply for Loan</h2>
              <p style={{ margin: "0 0 28px", color: "#71717a", fontSize: 14 }}>Select an active offer and enter your desired amount.</p>

              <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Select Offer</label>
              <select value={form.offerId} onChange={e => setForm(p => ({ ...p, offerId: e.target.value }))} style={inp}>
                <option value="">-- Select an offer --</option>
                {offers.map(o => (
                  <option key={o.id} value={o.id}>Offer #{o.id} • ${o.minAmount} - ${o.maxAmount} • {o.interestRate}% p.a.</option>
                ))}
              </select>

              <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Loan Amount ($)</label>
              <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} type="number" placeholder="Enter amount" style={inp} />

              {msg && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 10 }}>{msg}</p>}

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button onClick={handleSubmit} style={{ flex: 1, background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Submit Application</button>
                <button onClick={() => setView("dashboard")} style={{ flex: 1, background: "#fff", color: "#18181b", border: "1px solid #e4e4e7", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
