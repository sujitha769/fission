import { useState } from "react";
import "../styles/auth.css";
import API from "../api/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/signup", {
        name,
        email,
        password
      });

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Signup
          </button>
          
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;