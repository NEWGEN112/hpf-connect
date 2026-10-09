"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  status: string;
};

function LiveRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [ready, setReady] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [muted, setMuted] = useState(false);
  const [joined, setJoined] = useState(true);

  // Demo participants
  const participants = [
    { name: "You (Host)", speaking: !muted },
    { name: "Pst. Michael Adebiyi", speaking: false },
    { name: "General Secretary", speaking: false },
    { name: "Programme Coordinator", speaking: false },
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }

    if (!id) {
      setReady(true);
      return;
    }

    const meetings: Meeting[] = JSON.parse(
      localStorage.getItem("hpf_meetings") || "[]"
    );
    const found = meetings.find((m) => m.id === id) || null;
    setMeeting(found);
    setReady(true);
  }, [id, router]);

  function handleLeave() {
    setJoined(false);
    router.push("/live");
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
        Connecting...
      </main>
    );
  }

  if (!meeting) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center"
      }}>
        <p style={{ marginBottom: "20px" }}>Meeting not found.</p>
        <Link href="/live" style={{ color: "#d5a943" }}>
          ← Back to Live
        </Link>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "15px",
        borderBottom: "1px solid #222"
      }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80", marginBottom: "4px" }}>
            ● LIVE
          </div>
          <h1 style={{ fontSize: "18px", margin: 0 }}>
            {meeting.title}
          </h1>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: "12px" }}>
            {meeting.date} · {meeting.time}
          </p>
        </div>
        <div style={{
          background: "#1a1a1a",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          color: "#aaa"
        }}>
          {participants.length} online
        </div>
      </div>

      {/* Participants */}
      <div style={{
        flex: 1,
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px"
      }}>
        <div style={{ fontSize: "12px", color: "#d5a943", marginBottom: "15px" }}>
          PARTICIPANTS
        </div>

        {participants.map((p, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: i < participants.length - 1 ? "1px solid #222" : "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: p.speaking ? "#d5a943" : "#2a2a2a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
                color: p.speaking ? "#111" : "#aaa"
              }}>
                {p.name.charAt(0)}
              </div>
              <span style={{ fontSize: "14px" }}>{p.name}</span>
            </div>
            {p.speaking && (
              <span style={{ fontSize: "11px", color: "#4ade80" }}>Speaking</span>
            )}
          </div>
        ))}

        <p style={{
          color: "#555",
          fontSize: "12px",
          marginTop: "20px",
          textAlign: "center",
          lineHeight: "1.5"
        }}>
          Demo mode — Real audio conference will be connected later.
          <br />
          Everyone can already use this room layout.
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        paddingBottom: "10px"
      }}>
        <button
          onClick={() => setMuted(!muted)}
          style={{
            flex: 1,
            maxWidth: "160px",
            background: muted ? "#3a1515" : "#1a1a1a",
            color: muted ? "#ff6b6b" : "white",
            border: muted ? "1px solid #5a2222" : "1px solid #333",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {muted ? "🔇 Unmute" : "🎤 Mute"}
        </button>

        <button
          onClick={handleLeave}
          style={{
            flex: 1,
            maxWidth: "160px",
            background: "#5a1515",
            color: "white",
            border: "1px solid #7a2222",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Leave
        </button>
      </div>
    </main>
  );
}

export default function LiveRoomPage() {
  return (
    <Suspense fallback={
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        Connecting...
      </main>
    }>
      <LiveRoomContent />
    </Suspense>
  );
        }
