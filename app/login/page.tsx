"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const ACCESS_CODE = "HPF2026"; // Change this anytime

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      // Save a simple flag so the dashboard knows they are logged in
      if (typeof window !== "undefined") {
        localStorage.setItem("hpf_logged_in", "true");
      }
      router.push("/dashboard");
    } else {
      setError("Wrong access code. Please try again.");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "400px", 
        width: "100%", 
        background: "#111", 
        border: "1px solid #2a2a2a", 
        borderRadius: "16px", 
        padding: "40px 30px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#d5a943", marginBottom: "12px" }}>
          HOSTEL PRAYER FELLOWSHIP
        </div>
        
        <h1 style={{ fontSize: "32px", margin: "0 0 8px", fontWeight: "bold" }}>
          HPF CONNECT
        </h1>
        
        <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>
          Private Executive Platform
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Enter Access Code"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              letterSpacing: "2px",
              marginBottom: "15px",
              boxSizing: "border-box"
            }}
          />

          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", marginBottom: "15px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#d5a943",
              color: "#111",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            Enter HPF Connect
          </button>
        </form>

        <p style={{ color: "#555", fontSize: "12px", marginTop: "25px" }}>
          Only authorized HPF executives should have this code.
        </p>
      </div>
    </main>
  );
}
