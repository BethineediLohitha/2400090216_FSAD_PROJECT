function calcEMI(p, r, m) {
  if (!p || !m) return 0;
  const mr = r / 12 / 100;
  return Math.round((p * mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1));
}

export default function PaymentScreen({ loans = [] }) {
  const active = loans.filter(l => l.status === "active");

  return (
    <div style={{ padding: "28px 32px" }}>
      <h2 style={{ margin: "0 0 24px", fontWeight: 800, fontSize: 22 }}>Payment Schedule</h2>
      {active.map(loan => {
        const emi       = calcEMI(loan.amount, loan.interestRate, loan.duration);
        const remaining = loan.duration - loan.paidEmis;
        const pct       = Math.round((loan.paidEmis / loan.duration) * 100);
        return (
          <div key={loan.id} style={{
            background: "#fff", borderRadius: 14, padding: 24,
            marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontWeight: 800 }}>{loan.purpose}</h3>
                <span style={{ fontSize: 12, color: "#71717a" }}>Loan ID: {loan.id}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>${emi.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "#71717a" }}>per month</div>
              </div>
            </div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16, marginBottom: 16
            }}>
              {[
                ["Total Amount",   `$${loan.amount.toLocaleString()}`],
                ["EMIs Paid",      `${loan.paidEmis} / ${loan.duration}`],
                ["Remaining EMIs", remaining],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "#f9f9fb", borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#a1a1aa", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f4f4f5", borderRadius: 999, height: 8, overflow: "hidden", marginBottom: 16 }}>
              <div style={{
                background: "#22c55e", height: "100%",
                width: `${pct}%`, borderRadius: 999
              }} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{
                background: "#18181b", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 24px", fontWeight: 700
              }}>Pay EMI Now</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}