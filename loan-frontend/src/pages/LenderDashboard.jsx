import { useState, useEffect } from "react";
import { FileText, DollarSign, Users, Clock, CheckCircle, PlusCircle } from "lucide-react";
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

export default function LenderDashboard({ username, onLogout, onChangeRole }) {
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ minAmount: "", maxAmount: "", interestRate: "", termInMonths: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    try {
      const [appRes, offerRes] = await Promise.all([
        api.get("/loans/applications/lender"),
        api.get("/loans/offers/mine")
      ]);
      setApplications(appRes.data);
      setOffers(offerRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (id) => {
    try {
      await api.post(`/loans/applications/${id}/approve`);
      setMsg("Application approved successfully!");
      fetchData();
    } catch (err) { setMsg("Failed to approve."); }
  };

  const createOffer = async () => {
    if (!newOffer.minAmount || !newOffer.maxAmount || !newOffer.interestRate || !newOffer.termInMonths)
      return setMsg("Please fill all offer fields.");
    try {
      await api.post("/loans/offers", {
        minAmount: Number(newOffer.minAmount), maxAmount: Number(newOffer.maxAmount),
        interestRate: Number(newOffer.interestRate), termInMonths: Number(newOffer.termInMonths)
      });
      setNewOffer({ minAmount: "", maxAmount: "", interestRate: "", termInMonths: "" });
      setMsg("Offer published successfully!");
      fetchData();
    } catch (err) { setMsg(err.response?.data?.message || "Failed to create offer."); }
  };

  const activeApps = applications.filter(a => a.status === "APPROVED");
  const pendingApps = applications.filter(a => a.status === "PENDING");
  const disbursed = activeApps.reduce((s, a) => s + a.amount, 0);

  const inp = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e4e4e7", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f9fafb" };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 16, color: "#71717a" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Navbar onLogout={onLogout} onChangeRole={onChangeRole} />
      <div style={{ padding: "32px 36px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#71717a" }}>Welcome back,</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#18181b" }}>{username} <span style={{ fontSize: 14, fontWeight: 500, color: "#22c55e", background: "#f0fdf4", padding: "2px 10px", borderRadius: 20 }}>Lender</span></h1>
        </div>

        {msg && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "12px 18px", borderRadius: 10, marginBottom: 20, fontSize: 14 }}>{msg}</div>}

        <div style={{ display: "flex", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="My Offers" value={offers.length} color="#6366f1" Icon={FileText} />
          <StatCard label="Active Borrowers" value={activeApps.length} color="#22c55e" Icon={Users} />
          <StatCard label="Pending Requests" value={pendingApps.length} color="#f97316" Icon={Clock} />
          <StatCard label="Total Disbursed" value={`$${disbursed.toLocaleString()}`} color="#a855f7" Icon={DollarSign} />
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {/* Publish Offer */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 1, minWidth: 300, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <PlusCircle size={18} color="#6366f1" />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Publish Loan Offer</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Min Amount ($)" value={newOffer.minAmount} onChange={e => setNewOffer({ ...newOffer, minAmount: e.target.value })} style={inp} type="number" />
              <input placeholder="Max Amount ($)" value={newOffer.maxAmount} onChange={e => setNewOffer({ ...newOffer, maxAmount: e.target.value })} style={inp} type="number" />
              <input placeholder="Interest Rate (%)" value={newOffer.interestRate} onChange={e => setNewOffer({ ...newOffer, interestRate: e.target.value })} style={inp} type="number" />
              <input placeholder="Term (Months)" value={newOffer.termInMonths} onChange={e => setNewOffer({ ...newOffer, termInMonths: e.target.value })} style={inp} type="number" />
              <button onClick={createOffer} style={{ background: "#6366f1", color: "#fff", padding: "12px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14 }}>Publish Offer</button>
            </div>
          </div>

          {/* Pending Requests */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 1, minWidth: 300, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Clock size={18} color="#f97316" />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Pending Requests</h3>
            </div>
            {pendingApps.length === 0
              ? <div style={{ textAlign: "center", padding: "30px 0", color: "#a1a1aa" }}>
                  <CheckCircle size={36} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>No pending requests</p>
                </div>
              : pendingApps.map(app => (
                <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f4f4f5" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{app.borrower.username}</div>
                    <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>${app.amount.toLocaleString()} • Offer #{app.loanOffer.id}</div>
                  </div>
                  <button onClick={() => approve(app.id)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Approve</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
