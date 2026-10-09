"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  join_code: string;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState("");

  async function loadMeetings() {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("status", "upcoming")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setMeetings(data || []);
  }

  useEffect(() => {
    if (localStorage.getItem("hpf_logged_in") !== "true") {
      router.push("/login");
      return;
    }
    setReady(true);
    loadMeetings();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("hpf_logged_in");
    router.push("/login");
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this meeting for everyone?")) return;
    const { error } = await supabase.from("meetings").delete().eq("id", id);
    if (error) setError(error.message);
    else loadMeetings();
  }

  if (!ready) {
    return <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943" }}>HPF CONNECT</div>
          <h1 style={{ fontSize: "22px", margin: "4px 0 0" }}>Executive Dashboard</h1>
        </div>
        <button onClick={handleLogout} style={{ background: "#222", color: "#fff", border: "1px solid #444", padding: "10px 14px", borderRadius: "8px" }}>Logout</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
        <Link href="/meetings/new" style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", textAlign: "center", color: "white", textDecoration: "none" }}>Schedule</Link>
        <button onClick={loadMeetings} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px", color: "white" }}>Refresh</button>
      </div>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "16px" }}>
        <div style={{ color: "#d5a943", fontSize: "12px", marginBottom: "10px" }}>SHARED MEETINGS</div>
        {meetings.length === 0 ? (
          <p style={{ color: "#666" }}>No meeting yet. Schedule one and every phone will see it after refresh.</p>
        ) : meetings.map((m) => (
          <div key={m.id} style={{ borderTop: "1px solid #222", padding: "12px 0" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>{m.title}</h3>
            <p style={{ margin: "0 0 6px", color: "#aaa", fontSize: "13px" }}>{m.date} · {m.time}</p>
            <p style={{ margin: "0 0 10px", color: "#d5a943", fontSize: "13px" }}>Join code: {m.join_code}</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Link href={`/live/room?id=${m.id}`} style={{ background: "#d5a943", color: "#111", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: 700, fontSize: "12px" }}>Join</Link>
              <button onClick={() => handleDelete(m.id)} style={{ background: "#3a1515", color: "#ff6b6b", border: "1px solid #5a2222", padding: "8px 12px", borderRadius: "6px", fontSize: "12px" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
