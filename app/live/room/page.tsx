"use client";

import {
  useEffect,
  useRef,
  useState,
  Suspense
} from "react";

import {
  useRouter,
  useSearchParams
} from "next/navigation";

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

  const [title, setTitle] = useState("HPF Meeting");
  const [displayName, setDisplayName] = useState("HPF Executive");
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState("Checking your account...");

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      if (!id) {
        setStatus("No meeting selected.");
        return;
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("full_name, status")
          .eq("id", authData.user.id)
          .maybeSingle();

      if (cancelled) return;

      if (
        profileError ||
        !profile ||
        profile.status !== "approved"
      ) {
        setStatus("Your account is not approved for this meeting.");
        return;
      }

      const { data: meeting, error: meetingError } =
        await supabase
          .from("meetings")
          .select("title, status")
          .eq("id", id)
          .maybeSingle();

      if (cancelled) return;

      if (meetingError || !meeting) {
        setStatus("Meeting not found.");
        return;
      }

      if (meeting.status !== "upcoming") {
        setStatus("This meeting is not open.");
        return;
      }

      setTitle(meeting.title);
      setDisplayName(profile.full_name || "HPF Executive");
      setAuthorized(true);
      setStatus("Connecting to the meeting...");
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  useEffect(() => {
    if (!authorized || !id || !containerRef.current) return;

    let cancelled = false;
    let script: HTMLScriptElement | null = null;

    function startMeeting() {
      if (
        cancelled ||
        !containerRef.current ||
        !window.JitsiMeetExternalAPI
      ) {
        return;
      }

      const roomName =
        `hpfconnectroom${id}`.replace(/[^a-zA-Z0-9]/g, "");

      apiRef.current = new window.JitsiMeetExternalAPI(
        "meet.jit.si",
        {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: {
            displayName
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            prejoinPageEnabled: true,
            disableDeepLinking: true
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false,
            SHOW_CHROME_EXTENSION_BANNER: false
          }
        }
      );

      apiRef.current.addEventListener(
        "videoConferenceJoined",
        () => {
          if (!cancelled) {
            setStatus("You are connected to the live meeting.");
          }
        }
      );

      apiRef.current.addEventListener(
        "readyToClose",
        () => {
          if (!cancelled) {
            setStatus("You have left the meeting.");
          }
        }
      );

      setStatus("Opening the live meeting...");
    }

    if (window.JitsiMeetExternalAPI) {
      startMeeting();
    } else {
      script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = startMeeting;
      script.onerror = () => {
        if (!cancelled) {
          setStatus("Could not connect. Check your internet and refresh.");
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;

      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }

      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    };
  }, [authorized, id, displayName]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div style={{ fontSize: "10px", color: "#4ade80" }}>
            HPF CONNECT LIVE
          </div>

          <div style={{ fontSize: "16px", fontWeight: 700 }}>
            {title}
          </div>

          <div style={{ fontSize: "12px", color: "#aaa" }}>
            {status}
          </div>
        </div>

        <Link
          href="/dashboard"
          style={{
            color: "#d5a943",
            textDecoration: "none"
          }}
        >
          Leave
        </Link>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: "70vh",
          background: "#000"
        }}
      />
    </main>
  );
}

export default function LiveRoomPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          Loading HPF meeting...
        </main>
      }
    >
      <LiveRoomContent />
    </Suspense>
  );
}
