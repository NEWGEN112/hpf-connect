"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("hpf_logged_in");
    router.push("/login");
  }

  if (!ready) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        Checking access...
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        paddingBottom: "20px",
        borderBottom: "1px solid #222"
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943" }}>
            HPF CONNECT
          </div>
          <h1 style={{ fontSize: "24px", margin: "5px 0 0" }}>
            Executive Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#1a1a1a",
            color: "#aaa",
            border: "1px solid #333",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "25px"
      }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "20px" }}>
          Welcome, Executive
        </h2>
        <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>
          One Fellowship. One Mission. One Voice.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginBottom: "30px"
      }}>
        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📅</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>Meetings</div>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎙️</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>Join Live</div>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📝</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>Minutes</div>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔔</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>Notifications</div>
        </div>
      </div>

      {/* Upcoming Meeting */}
      <div style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "20px"
      }}>
        <div style={{ fontSize: "12px", color: "#d5a943", marginBottom: "10px" }}>
          UPCOMING MEETING
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>
          HPF Executive Meeting
        </h3>
        <p style={{ color: "#888", margin: "0 0 15px", fontSize: "14px" }}>
          No upcoming meeting scheduled yet.
        </p>
        <button style={{
          background: "#d5a943",
          color: "#111",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          fontWeight: "600",
          fontSize: "13px"
        }}>
          Schedule Meeting
        </button>
      </div>
    </main>
  );
}
