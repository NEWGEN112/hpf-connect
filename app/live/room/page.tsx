"use client";

import { useEffect, useRef, useState, Suspense } from "react";
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

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

function LiveRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [status, setStatus] = useState("Connecting to live room...");

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

  useEffect(() => {
    if (!ready || !meeting || !containerRef.current) return;

    let cancelled = false;

    function startJitsi() {
      if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;

      const roomName = `hpfconnect${meeting.id}`.replace(/[^a-zA-Z0-9]/g, "");

      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: {
          displayName: "HPF Executive"
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          disableDeepLinking: true
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          SHOW_CHROME_EXTENSION_BANNER: false
        }
      });

      setStatus("Live — others with this same meeting can join and hear you.");
    }

    if (window.JitsiMeetExternalAPI) {
      startJitsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = startJitsi;
      script.onerror = () => setStatus("Could not connect to the live call service. Check your internet and try again.");
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [ready, meeting]);

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
        <p style={{ marginBottom: "20px" }}>Meeting not found on this phone.</p>
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
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid #222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
      }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80" }}>● LIVE AUDIO</div>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{meeting.title}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{status}</div>
        </div>
        <Link href="/dashboard" style={{
          color: "#d5a943",
          textDecoration: "none",
          fontSize: "13px",
          whiteSpace: "nowrap"
        }}>
          Leave
        </Link>
      </div>

      <div
        ref={containerRef}
        style={{ flex: 1, minHeight: "70vh", background: "#000" }}
      />
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
