"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type RequestRow = {
  id: string;
  display_name: string;
  status: string;
  user_id: string;
};

export default function WaitingPage() {
  const params = useParams();
  const id = String(params.id || "");
  const router = useRouter();
  const [me, setMe] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [myStatus, setMyStatus] = useState("waiting");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [title, setTitle] = useState("Meeting");

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id || "";
    setMe(uid);
    if (!uid) {
      router.push("/login");
      return;
    }
    const { data: meeting } = await supabase.from("meetings").select("title, host_id").eq("id", id).maybeSingle();
    if (meeting?.title) setTitle(meeting.title);
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).maybeSingle();
    setIsHost(profile?.role === "admin" || profile?.role === "president" || meeting?.host_id === uid);
    const { data: mine } = await supabase.from("meeting_requests").select("status").eq("meeting_id", id).eq("user_id", uid).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (mine?.status) setMyStatus(mine.status);
    if (mine?.status === "admitted") router.push(`/live/room?id=${id}`);
    if (isHost || profile?.role === "admin" || profile?.role === "president") {
      const { data } = await supabase.from("meeting_requests").select("*").eq("meeting_id", id).order("created_at", { ascending: false });
      setRows(data || []);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [id]);

  async function decide(requestId: string, status: string) {
    await supabase.from("meeting_requests").update({ status }).eq("id", requestId);
    load();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "22px" }}>{title}</h1>
      {!isHost && (
        <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px" }}>
          <p>Waiting for the host to admit you.</p>
          <p style={{ color: myStatus === "rejected" ? "#ff6b6b" : "#d5a943" }}>Status: {myStatus}</p>
          {myStatus === "rejected" && <p>The host did not admit you to this meeting.</p>}
        </div>
      )}
      {isHost && (
        <div>
          <h2 style={{ fontSize: "16px", color: "#d5a943" }}>Waiting room</h2>
          {rows.filter((r) => r.status === "waiting").length === 0 && <p style={{ color: "#666" }}>No one is waiting.</p>}
          {rows.filter((r) => r.status === "waiting").map((r) => (
            <div key={r.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "12px", marginBottom: "10px" }}>
              <strong>{r.display_name}</strong>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => decide(r.id, "admitted")} style={{ background: "#14532d", color: "#bbf7d0", border: "none", padding: "8px 12px", borderRadius: "6px" }}>Admit</button>
                <button onClick={() => decide(r.id, "rejected")} style={{ background: "#3a1515", color: "#ff6b6b", border: "none", padding: "8px 12px", borderRadius: "6px" }}>Reject</button>
              </div>
            </div>
          ))}
          <h2 style={{ fontSize: "16px", color: "#d5a943" }}>Admitted</h2>
          {rows.filter((r) => r.status === "admitted").map((r) => (
            <p key={r.id}>{r.display_name}</p>
          ))}
          <Link href={`/live/room?id=${id}`} style={{ display: "inline-block", marginTop: "12px", background: "#d5a943", color: "#111", padding: "10px 14px", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>Enter meeting</Link>
        </div>
      )}
    </main>
  );
    }
