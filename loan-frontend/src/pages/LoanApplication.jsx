// Standalone reusable component — imported by BorrowerDashboard if needed
import { useState } from "react";

const PURPOSES  = ["Home Renovation","Business Expansion","Education",
                   "Medical Emergency","Vehicle Purchase","Personal","Travel","Wedding"];
const DURATIONS = [6,12,18,24,36,48,60];

function calcEMI(p, r, m) {
  if (!p || !m) return 0;
  const mr = r / 12 / 100;
  return Math.round((p * mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1));
}

export default function LoanApplication({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ amount:"", purpose:"", duration:"", notes:"" });
  const emi = calcEMI(parseFloat(form.amount)||0, 8.5, parseInt(form.duration)||0);

  const inputStyle = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:"1px solid #e4e4e7", fontSize:14, outline:"none",
    boxSizing:"border-box", background:"#f4f4f5", marginTop:6
  };

  return (
    <div style={{ background:"#fff", borderRadius:16, padding:"32px 36px",
      boxShadow:"0 1px 4px rgba(0,0,0,0.06)", maxWidth:700 }}>
      <h2 style={{ margin:"0 0 4px", fontWeight:800, fontSize:20 }}>Apply for Loan</h2>
      <p style={{ margin:"0 0 24px", color:"#71717a", fontSize:14 }}>
        Fill in the details to submit your loan application
      </p>

      <label style={{ fontSize:13, fontWeight:600, display:"block", marginTop:16 }}>Loan Amount ($)</label>
      <input value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}
        type="number" placeholder="Enter amount" style={inputStyle} />

      <label style={{ fontSize:13, fontWeight:600, display:"block", marginTop:16 }}>Purpose</label>
      <select value={form.purpose} onChange={e=>setForm(p=>({...p,purpose:e.target.value}))} style={inputStyle}>
        <option value="">Select loan purpose</option>
        {PURPOSES.map(p=><option key={p}>{p}</option>)}
      </select>

      <label style={{ fontSize:13, fontWeight:600, display:"block", marginTop:16 }}>Duration (months)</label>
      <select value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} style={inputStyle}>
        <option value="">Select duration</option>
        {DURATIONS.map(d=><option key={d}>{d}</option>)}
      </select>

      <label style={{ fontSize:13, fontWeight:600, display:"block", marginTop:16 }}>
        Additional Details (Optional)
      </label>
      <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
        placeholder="Provide any additional information..."
        style={{ ...inputStyle, height:90, resize:"vertical" }} />

      <div style={{ background:"#eff6ff", borderRadius:12, padding:"18px 20px", marginTop:20 }}>
        <h4 style={{ margin:"0 0 10px", fontWeight:700, fontSize:15 }}>Estimated Details</h4>
        <div style={{ fontSize:13, color:"#3b82f6", lineHeight:2 }}>
          <div>Interest Rate: 8.5% per annum</div>
          <div>Processing Fee: 2% of loan amount</div>
          <div>Estimated EMI: ${emi.toLocaleString()} per month</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:14, marginTop:28 }}>
        <button onClick={()=>onSubmit&&onSubmit(form)}
          style={{ flex:1, background:"#18181b", color:"#fff", border:"none",
            borderRadius:10, padding:"13px", fontWeight:700, fontSize:15 }}>
          Submit Application
        </button>
        <button onClick={onCancel}
          style={{ flex:1, background:"#fff", color:"#18181b",
            border:"1px solid #e4e4e7", borderRadius:10, padding:"13px",
            fontWeight:700, fontSize:15 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}