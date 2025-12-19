import { useState } from "react";
import "../styles/auth.css";
import API from "../api/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Signup</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? <span className="btn-loader"></span> : "Signup"}
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>

  
      <style>
        {`
          .btn-loader {
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Signup;
