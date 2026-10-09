"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function JoinMeetingPage() {
  const params = useParams();
  const id = String(params.id || "");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase.from("meetings").select("title, status").eq("id", id).maybeSingle();
      if (error || !data) {
        setError("Meeting not found.");
        setReady(true);
        return;
      }
      setTitle(data.title);
      setStatus(data.status);
      setReady(true);
    })();
  }, [id, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (status !== "upcoming") {
      setError("This meeting is not open.");
      return;
    }
    const { data, error } = await supabase.from("meetings").select("join_code").eq("id", id).maybeSingle();
    if (error || !data) {
      setError("Could not check the code.");
      return;
    }
    if (code.trim().toUpperCase() !== String(data.join_code || "").toUpperCase()) {
      setError("Wrong meeting code. Ask the host for this meeting's code.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userData.user?.id).maybeSingle();
    await supabase.from("meeting_requests").insert({
      meeting_id: id,
      user_id: userData.user?.id,
      display_name: profile?.full_name || "HPF Member",
      status: "waiting"
    });
    router.push(`/waiting/${id}`);
  }

  if (!ready) return <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: "420px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "#d5a943", letterSpacing: "2px" }}>MEETING CODE</div>
        <h1 style={{ fontSize: "22px" }}>{title || "Meeting"}</h1>
        <p style={{ color: "#888", fontSize: "14px" }}>Enter this meeting's own access code. A correct code takes you to the waiting room, not the call.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Access code" style={{ width: "100%", padding: "14px", textAlign: "center", letterSpacing: "2px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
        <button style={{ width: "100%", marginTop: "12px", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>Continue</button>
        <p><Link href="/dashboard" style={{ color: "#888" }}>Cancel</Link></p>
      </form>
    </main>
  );
      }
