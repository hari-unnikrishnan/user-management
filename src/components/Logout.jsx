import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./App.css";
// import bgImage from './assets/image/download 1.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length > 0;

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // For demo purposes, set dummy token and company_id
      localStorage.setItem("token", "dummy_token");
      localStorage.setItem("company_id", "dummy_company_id");

      navigate("/users");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page" >
      <h1 className="logo">LOGO</h1>

      <div className="login-card">
        <h2>Sign in</h2>
        <p className="subtitle">Log in to manage your account</p>

        <label>Email</label>
        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>Password</label>
        <div className="input-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-options">
          <label className="remember">
            <input type="checkbox"  />
            Remember me
          </label>
          <span className="forgot">Forgot password ?</span>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="login-btn"
          disabled={!isValid || loading}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <style>
        {`
          /* ================= STATUS TOGGLE ================= */
                    input[type="checkbox"] {
              -webkit-appearance: none;
              appearance: none;

              width: 22px;
              height: 22px;
              border: 2px solid #7b6cff;
              border-radius: 4px;        /* square checkbox */
              cursor: pointer;
              position: relative;
              background: #fff;
            }

            input[type="checkbox"]:checked {
              background: #ffffff;
              border-color: #7b6cff;
            }

            
            /* ✔ Tick mark */
            input[type="checkbox"]:checked::before {
              content: "✔";
              // color: #fff;
              font-size: 16px;
              font-weight: bold;
            background: #00000000;
              position: absolute;
              top: 46%;
                left: 57%;
              transform: translate(-50%, -55%);
            }

        `}
      </style>
    </div>
  );
}
