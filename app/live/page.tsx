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

export default function LivePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }
    const saved = JSON.parse(localStorage.getItem("hpf_meetings") || "[]");
    setMeetings(saved.filter((m: Meeting) => m.status === "upcoming"));
    setReady(true);
  }, [router]);

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
        Loading...
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
      <div style={{ marginBottom: "25px" }}>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none", fontSize: "14px" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943", marginBottom: "8px" }}>
        HPF CONNECT
      </div>
      <h1 style={{ fontSize: "26px", margin: "0 0 8px" }}>
        Join Live Conference
      </h1>
      <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>
        Select a meeting and join the live room
      </p>

      {meetings.length === 0 ? (
        <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "25px",
          textAlign: "center"
        }}>
          <p style={{ color: "#666", margin: "0 0 15px" }}>
            No upcoming meetings available.
          </p>
          <Link href="/meetings/new" style={{
            background: "#d5a943",
            color: "#111",
            padding: "12px 18px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "14px"
          }}>
            Schedule a Meeting
          </Link>
        </div>
      ) : (
        meetings.map((m) => (
          <div key={m.id} style={{
            background: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px"
          }}>
            <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>
              {m.title}
            </h2>
            <p style={{ color: "#aaa", margin: "0 0 6px", fontSize: "13px" }}>
              📅 {m.date} &nbsp; ⏰ {m.time}
            </p>
            {m.agenda && (
              <p style={{ color: "#777", margin: "0 0 16px", fontSize: "13px" }}>
                {m.agenda}
              </p>
            )}
            <Link
              href={`/live/room?id=${m.id}`}
              style={{
                display: "inline-block",
                background: "#d5a943",
                color: "#111",
                padding: "12px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px"
              }}
            >
              🎙️ Join Meeting
            </Link>
          </div>
        ))
      )}
    </main>
  );
                  }
