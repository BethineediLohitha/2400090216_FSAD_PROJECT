import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";

function StatCard({ label, value, color, Icon, sub }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", flex: 1, minWidth: 180, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 13, color: "#71717a", fontWeight: 500 }}>{label}</span>
        <div style={{ background: color + "20", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#18181b", marginTop: 12 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 10, color: "#71717a", fontWeight: 600 }}>{d.value > 0 ? `$${(d.value/1000).toFixed(0)}k` : ""}</div>
          <div style={{ width: "70%", height: `${(d.value / max) * 100}%`, background: color, borderRadius: "4px 4px 0 0", minHeight: d.value > 0 ? 4 : 0, transition: "height 0.3s" }} />
          <div style={{ fontSize: 11, color: "#71717a" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalystDashboard({ username, onLogout, onChangeRole }) {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    api.get("/reports/transactions").then(r => setTxns(r.data)).catch(console.error);
  }, []);

  const totalDisbursed = txns.filter(t => t.type === "LOAN_DISBURSEMENT").reduce((s, t) => s + t.amount, 0);
  const totalRecovered = txns.filter(t => t.type === "LOAN_REPAYMENT").reduce((s, t) => s + t.amount, 0);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = months.map((label, i) => ({
    label,
    value: txns.filter(t => t.type === "LOAN_DISBURSEMENT" && new Date(t.createdAt).getMonth() === i).reduce((s, t) => s + t.amount, 0)
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Navbar onLogout={onLogout} onChangeRole={onChangeRole} />
      <div style={{ padding: "32px 36px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#71717a" }}>Welcome back,</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#18181b" }}>{username} <span style={{ fontSize: 14, fontWeight: 500, color: "#a855f7", background: "#f3e8ff", padding: "2px 10px", borderRadius: 20 }}>Analyst</span></h1>
        </div>

        <div style={{ display: "flex", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard label="Total Disbursed"   value={`$${totalDisbursed.toLocaleString()}`} color="#22c55e" Icon={ArrowUpRight}   sub="All time loan disbursements" />
          <StatCard label="Total Recovered"   value={`$${totalRecovered.toLocaleString()}`} color="#a855f7" Icon={ArrowDownRight} sub="All time repayments" />
          <StatCard label="Live Transactions" value={txns.length}                            color="#3b82f6" Icon={BarChart2}      sub="Total recorded transactions" />
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 2, minWidth: 320, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color="#3b82f6" />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Monthly Disbursements</h3>
            </div>
            <BarChart data={monthlyData} color="#6366f1" />
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 28, flex: 1, minWidth: 260, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <DollarSign size={18} color="#22c55e" />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Key Metrics</h3>
            </div>
            {[
              { label: "Total Disbursed",  value: `$${totalDisbursed.toLocaleString()}`,  bg: "#f0fdf4", color: "#15803d" },
              { label: "Total Recovered",  value: `$${totalRecovered.toLocaleString()}`,  bg: "#f3e8ff", color: "#7c3aed" },
              { label: "Net Outstanding",  value: `$${(totalDisbursed - totalRecovered).toLocaleString()}`, bg: "#eff6ff", color: "#1d4ed8" },
              { label: "Transactions",     value: txns.length,                             bg: "#fef9c3", color: "#a16207" },
            ].map(m => (
              <div key={m.label} style={{ background: m.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#52525b", fontWeight: 500 }}>{m.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <BarChart2 size={18} color="#6366f1" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Recent Transactions</h3>
          </div>
          {txns.length === 0
            ? <p style={{ color: "#a1a1aa", textAlign: "center", padding: "20px 0" }}>No transactions yet.</p>
            : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["#","Type","Amount","Date"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txns.slice(0, 10).map((t, i) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f4f4f5" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#a1a1aa" }}>{i + 1}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: t.type === "LOAN_DISBURSEMENT" ? "#dcfce7" : "#dbeafe", color: t.type === "LOAN_DISBURSEMENT" ? "#15803d" : "#1d4ed8", padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                          {t.type.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#18181b" }}>${t.amount.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#71717a" }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  );
}
