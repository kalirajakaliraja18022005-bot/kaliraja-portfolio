import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import "./admin.css";

const API_URL = "https://kaliraja-portfolio-backend.onrender.com";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid username or password");
      }

      // Save user session
      localStorage.setItem("admin_user", JSON.stringify(data));
      localStorage.setItem("admin_auth", "true");

      if (onLogin) {
        onLogin();
      } else {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        
        {/* LOGO */}
        <div className="admin-logo">K</div>

        <h1>Admin Portal</h1>
        <p className="admin-subtitle">Kaliraja Portfolio Management</p>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          
          {/* USERNAME */}
          <label htmlFor="username">Username</label>
          <div style={{ position: "relative" }}>
            <input
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{ paddingLeft: "38px" }}
            />
            <User
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64717d",
              }}
            />
          </div>

          {/* PASSWORD */}
          <label htmlFor="password" style={{ marginTop: "16px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingLeft: "38px", paddingRight: "40px" }}
            />
            <Lock
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64717d",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64717d",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && <div className="login-error">{error}</div>}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* BACK TO MAIN PORTFOLIO LINK */}
        <div className="back-portfolio">
          <a href="/">← Back to Live Portfolio</a>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;