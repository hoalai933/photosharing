
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, backend }) {
  const [creds, setCreds] = useState({});
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch((backend || "") + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      });
      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Login failed");
      }
      const data = await res.json();
      onLogin(data.user, data.token);
      navigate("/posts");
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <div>
        <div>Username:</div>
        <input onChange={e => setCreds({ ...creds, username: e.target.value })} />
      </div>
      <div>
        <div>Password:</div>
        <input type="password" onChange={e => setCreds({ ...creds, password: e.target.value })} />
      </div>
      <div style={{marginTop:10}}>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div style={{marginTop:10, fontSize:12, color:'#555'}}>Try admin / 123 (demo)</div>
    </div>
  );
}
