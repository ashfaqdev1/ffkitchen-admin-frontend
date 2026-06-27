import React, { useState } from "react";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API call endpoint integrated below
      const response = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      // return console.log(result);

      if (response.ok) {
        const token = result.token;
        const userPayload = result.data;

        // 1. SAVE credentials dynamically into the browser cache
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userPayload));

        setIsSubmitting(false);

        // 2. Pass control stream back up to unlock application framework
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setError(
          result.message || "Invalid administrative email address or password.",
        );
      }
    } catch (err) {
      setIsSubmitting(false);
      setError("Connection error. Could not connect to authentication server.");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#0c0c0e",
        fontFamily: "Sora, sans-serif",
        padding: "20px",
      }}
    >
      <div
        className="login-card"
        style={{
          background: "#141416",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🫖</div>
          <h2
            style={{
              color: "#ffffff",
              margin: "0 0 4px 0",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            FFKITCHEN
          </h2>
          <p
            style={{
              color: "var(--gold, #d4af37)",
              margin: 0,
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "2px",
            }}
          >
            SECURED TERMINAL ACCESS
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "13px",
                textAlign: "center",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                animation: "shake 0.3s ease-in-out",
              }}
            >
              ✕ {error}
            </div>
          )}

          <div
            className="form-group"
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <label
              style={{ color: "#8a8a93", fontSize: "13px", fontWeight: "500" }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@ffkitchen.pk"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                background: "#1c1c1f",
                border: "1px solid #2e2e33",
                borderRadius: "8px",
                color: "#ffffff",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>

          <div
            className="form-group"
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <label
              style={{ color: "#8a8a93", fontSize: "13px", fontWeight: "500" }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                background: "#1c1c1f",
                border: "1px solid #2e2e33",
                borderRadius: "8px",
                color: "#ffffff",
                padding: "0 14px",
                fontSize: "14px",
                outline: "none",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-confirm primary"
            disabled={isSubmitting}
            style={{
              height: "46px",
              width: "100%",
              marginTop: "10px",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "0.5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Authenticating Connection..." : "Sign In Securely"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span
            style={{
              color: "#63636e",
              fontSize: "11px",
              letterSpacing: "0.5px",
            }}
          >
            Production Authentication Cluster Node
          </span>
        </div>
      </div>
    </div>
  );
}
