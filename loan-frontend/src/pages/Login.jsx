import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Shield, TrendingUp, Users, Briefcase } from "lucide-react";
import api from "../api";

const bg = "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)";
const card = { background: "#fff", borderRadius: 24, padding: "40px 44px", width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" };
const inp = (icon) => ({ position: "relative", marginBottom: 16 });

function Input({ icon: Icon, type = "text", placeholder, value, onChange, right }) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }}>
        <Icon size={16} />
      </div>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1.5px solid #e4e4e7", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fafafa", paddingRight: right ? 42 : 14 }}
      />
      {right && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#a1a1aa" }}>{right}</div>}
    </div>
  );
}

export default function Login({ onLoginSuccess, defaultRole = "borrower" }) {
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "", confirm: "", role: defaultRole });
  const [showSignPwd, setShowSignPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) return setError("Please fill all fields");
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/signin", { username, password });
      setSuccess("Login successful!");
      onLoginSuccess(res.data);
    } catch (err) {
      setError(!err.response ? "Cannot connect to server. Start the backend first." : err.response?.data?.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!signupForm.username || !signupForm.email || !signupForm.password) return setError("Please fill all fields");
    if (signupForm.password !== signupForm.confirm) return setError("Passwords do not match");
    if (signupForm.password.length < 6) return setError("Password must be at least 6 characters");
    setError(""); setLoading(true);
    try {
      await api.post("/auth/signup", { username: signupForm.username, email: signupForm.email, password: signupForm.password, role: signupForm.role });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => { setView("login"); setUsername(signupForm.username); setSuccess(""); }, 1500);
    } catch (err) {
      setError(!err.response ? "Cannot connect to server." : err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  const topBar = (
    <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", height: 56, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "#6366f1", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>L</span>
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>LoanManager Pro</span>
      </div>
      <button onClick={() => { setView(view === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
        style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
        {view === "login" ? "Create Account" : "Sign In"}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column" }}>
      {topBar}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {view === "login" ? (
          <div style={card}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={26} color="#fff" />
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#18181b" }}>Welcome Back</h2>
              <p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>Sign in to your LoanManager account</p>
            </div>

            <Input icon={User} placeholder="Username" value={username} onChange={e => { setUsername(e.target.value); setError(""); }} />
            <Input icon={Lock} type={showPwd ? "text" : "password"} placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              right={<span onClick={() => setShowPwd(!showPwd)}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</span>} />

            {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>}
            {success && <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{success}</div>}

            <button disabled={loading} onClick={handleSignIn}
              style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 16 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#71717a" }}>DEMO ACCOUNTS</p>
              {[["admin","admin123","Admin"],["lender1","lender123","Lender"],["borrower1","borrower123","Borrower"],["analyst1","analyst123","Analyst"]].map(([u,p,r]) => (
                <div key={u} onClick={() => { setUsername(u); setPassword(p); }} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{u}</span>
                  <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 500 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={card}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={26} color="#fff" />
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#18181b" }}>Create Account</h2>
              <p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>Join LoanManager Pro today</p>
            </div>

            <Input icon={User} placeholder="Username" value={signupForm.username} onChange={e => setSignupForm({ ...signupForm, username: e.target.value })} />
            <Input icon={Mail} placeholder="Email address" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} />

            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }}><Briefcase size={16} /></div>
              <select value={signupForm.role} onChange={e => setSignupForm({ ...signupForm, role: e.target.value })}
                style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: "1.5px solid #e4e4e7", fontSize: 14, outline: "none", background: "#fafafa", appearance: "none" }}>
                <option value="borrower">Borrower - Apply for loans</option>
                <option value="lender">Lender - Offer loans</option>
                <option value="analyst">Financial Analyst - View reports</option>
                <option value="admin">Admin - Manage platform</option>
              </select>
            </div>

            <Input icon={Lock} type={showSignPwd ? "text" : "password"} placeholder="Password (min 6 chars)" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
              right={<span onClick={() => setShowSignPwd(!showSignPwd)}>{showSignPwd ? <EyeOff size={16} /> : <Eye size={16} />}</span>} />
            <Input icon={Lock} type="password" placeholder="Confirm Password" value={signupForm.confirm} onChange={e => setSignupForm({ ...signupForm, confirm: e.target.value })} />

            {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>}
            {success && <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{success}</div>}

            <button disabled={loading} onClick={handleSignup}
              style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
