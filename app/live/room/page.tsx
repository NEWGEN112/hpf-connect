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
  joinCode?: string;
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
  const [code, setCode] = useState("");
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Waiting for approval code...");

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
    const meetings: Meeting[] = JSON.parse(localStorage.getItem("hpf_meetings") || "[]");
    const found = meetings.find((m) => m.id === id) || null;
    setMeeting(found);
    if (found && !found.joinCode) setApproved(true);
    setReady(true);
  }, [id, router]);

  function approve(e: React.FormEvent) {
    e.preventDefault();
    if (!meeting?.joinCode) {
      setApproved(true);
      return;
    }
    if (code.trim().toUpperCase() === meeting.joinCode.toUpperCase()) {
      setApproved(true);
      setError("");
      setStatus("Approved. Connecting to the live call...");
    } else {
      setError("Wrong join code. Only approved executives can enter.");
    }
  }

  useEffect(() => {
    if (!approved || !meeting || !containerRef.current) return;
    let cancelled = false;

    function startJitsi() {
      if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI || !meeting) return;
      const secret = (meeting.joinCode || "open").toLowerCase();
      const roomName = `hpf\( {meeting.id} \){secret}`.replace(/[^a-zA-Z0-9]/g, "");
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: { displayName: "HPF Executive" },
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
      setStatus("Live. Only people with this join code can enter.");
    }

    if (window.JitsiMeetExternalAPI) startJitsi();
    else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = startJitsi;
      script.onerror = () => setStatus("Could not connect. Check internet and try again.");
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [approved, meeting]);

  if (!ready) {
    return <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>Loading...</main>;
  }

  if (!meeting) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>
        <p>Meeting not found on this phone.</p>
        <Link href="/dashboard" style={{ color: "#d5a943" }}>← Back</Link>
      </main>
    );
  }

  if (!approved) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={approve} style={{ width: "100%", maxWidth: "400px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943", marginBottom: "10px" }}>PRESIDENT APPROVAL</div>
          <h1 style={{ fontSize: "22px", margin: "0 0 8px" }}>{meeting.title}</h1>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>Enter the join code shared by the president.</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Join code" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", textAlign: "center", letterSpacing: "2px", marginBottom: "12px", boxSizing: "border-box" }} />
          {error && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</p>}
          <button type="submit" style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>Enter Meeting</button>
          <div style={{ marginTop: "16px" }}><Link href="/dashboard" style={{ color: "#888", fontSize: "13px" }}>Cancel</Link></div>
        </form>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80" }}>● APPROVED LIVE CALL</div>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{meeting.title}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{status}</div>
        </div>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none", fontSize: "13px" }}>Leave</Link>
      </div>
      <div ref={containerRef} style={{ flex: 1, minHeight: "70vh", background: "#000" }} />
    </main>
  );
}

export default function LiveRoomPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>}>
      <LiveRoomContent />
    </Suspense>
  );
            }
