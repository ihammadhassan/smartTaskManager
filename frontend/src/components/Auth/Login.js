import { useState, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", { email, password });
    login(res.data.token);
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Log In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px" }}>Login</button>
      </form>
    <p style={{ marginTop: "10px" }}>
        Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/signup")}>Register</span>
      </p>
    </div>
  );
}