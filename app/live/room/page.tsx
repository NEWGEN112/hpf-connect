"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

function LiveRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [title, setTitle] = useState("HPF Executive Meeting");
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    if (localStorage.getItem("hpf_logged_in") !== "true") {
      router.push("/login");
      return;
    }
    if (!id) return;
    supabase.from("meetings").select("title").eq("id", id).maybeSingle().then(({ data }) => {
      if (data?.title) setTitle(data.title);
    });
  }, [id, router]);

  useEffect(() => {
    if (!id || !containerRef.current) return;
    if (localStorage.getItem("hpf_logged_in") !== "true") return;
    let cancelled = false;

    function startJitsi() {
      if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) return;
      const roomName = `hpfconnectroom${id}`.replace(/[^a-zA-Z0-9]/g, "");
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
      setStatus("Live. Same link works on every phone.");
    }

    if (window.JitsiMeetExternalAPI) startJitsi();
    else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = startJitsi;
      script.onerror = () => setStatus("Could not connect. Check internet and refresh.");
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [id]);

  if (!id) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", padding: "20px" }}>
        <p>Open a meeting from the Dashboard.</p>
        <Link href="/dashboard" style={{ color: "#d5a943" }}>Back</Link>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80" }}>LIVE CALL</div>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{status}</div>
        </div>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none" }}>Leave</Link>
      </div>
      <div ref={containerRef} style={{ flex: 1, minHeight: "70vh", background: "#000" }} />
    </main>
  );
}

export default function LiveRoomPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Connecting...</main>}>
      <LiveRoomContent />
    </Suspense>
  );
}
