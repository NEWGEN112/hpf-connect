"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  status: string;
};

export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }
    setReady(true);
    loadMeetings();
  }, [router]);

  function loadMeetings() {
    const saved = JSON.parse(localStorage.getItem("hpf_meetings") || "[]");
    setMeetings(saved);
  }

  function handleLogout() {
    localStorage.removeItem("hpf_logged_in");
    router.push("/login");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this meeting?");
    if (!confirmed) return;

    const updated = meetings.filter((m) => m.id !== id);
    localStorage.setItem("hpf_meetings", JSON.stringify(updated));
    setMeetings(updated);
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

  const upcoming = meetings.filter((m) => m.status === "upcoming");

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
        marginBottom: "35px",
        paddingBottom: "20px",
        borderBottom: "1px solid #222"
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943" }}>
            HPF CONNECT
          </div>
          <h1 style={{ fontSize: "22px", margin: "5px 0 0" }}>
            Executive Dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
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
        padding: "22px",
        marginBottom: "22px"
      }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "18px" }}>
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
        gap: "12px",
        marginBottom: "25px"
      }}>
        <Link href="/meetings/new" style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "18px",
          textAlign: "center",
          textDecoration: "none",
          color: "white"
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>📅</div>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>Schedule</div>
        </Link>

        <Link href="/live" style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "18px",
          textAlign: "center",
          textDecoration: "none",
          color: "white"
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>🎙️</div>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>Join Live</div>
        </Link>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "18px",
          textAlign: "center",
          opacity: 0.6
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>📝</div>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>Minutes</div>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "18px",
          textAlign: "center",
          opacity: 0.6
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>🔔</div>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>Notifications</div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "20px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <div style={{ fontSize: "12px", color: "#d5a943" }}>
            UPCOMING MEETINGS
          </div>
          <Link href="/meetings/new" style={{
            background: "#d5a943",
            color: "#111",
            padding: "8px 14px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "12px"
          }}>
            + Schedule
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
            No upcoming meeting scheduled yet.
          </p>
        ) : (
          upcoming.map((m) => (
            <div key={m.id} style={{
              borderTop: "1px solid #222",
              padding: "14px 0",
              marginTop: "8px"
            }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>
                {m.title}
              </h3>
              <p style={{ color: "#aaa", margin: "0 0 4px", fontSize: "13px" }}>
                📅 {m.date} &nbsp; ⏰ {m.time}
              </p>
              {m.agenda && (
                <p style={{ color: "#777", margin: "0 0 12px", fontSize: "13px" }}>
                  {m.agenda}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                <Link
                  href={`/live/room?id=${m.id}`}
                  style={{
                    background: "#d5a943",
                    color: "#111",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}
                >
                  Join Live
                </Link>
                <Link
                  href={`/meetings/edit?id=${m.id}`}
                  style={{
                    background: "#222",
                    color: "#d5a943",
                    border: "1px solid #444",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    background: "#3a1515",
                    color: "#ff6b6b",
                    border: "1px solid #5a2222",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
            }
