"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tab, setTab] = useState("upcoming");
  const [error, setError] = useState("");

  async function load(status = tab) {
    const { data, error } = await supabase.from("meetings").select("*").eq("status", status).order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setMeetings(data || []);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      const { data: me } = await supabase.from("profiles").select("role, status").eq("id", data.user.id).maybeSingle();
      if (!me || me.status !== "approved") {
        router.push("/login");
        return;
      }
      setIsAdmin(["admin", "president"].includes(me.role));
      setReady(true);
      load("upcoming");
    })();
  }, [router]);

  async function cancelMeeting(id: string) {
    if (!window.confirm("Cancel this meeting for everyone?")) return;
    const { error } = await supabase.from("meetings").update({ status: "cancelled" }).eq("id", id);
    if (error) setError(error.message);
    else load(tab);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!ready) return <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#d5a943", letterSpacing: "2px" }}>HPF CONNECT</div>
          <h1 style={{ margin: "4px 0 0", fontSize: "22px" }}>Dashboard</h1>
        </div>
        <button onClick={signOut} style={{ background: "#222", color: "#fff", border: "1px solid #444", padding: "8px 12px", borderRadius: "8px" }}>Logout</button>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        {isAdmin && <Link href="/meetings/new" style={{ background: "#d5a943", color: "#111", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>Schedule</Link>}
        {isAdmin && <Link href="/admin" style={{ background: "#222", color: "#d5a943", padding: "8px 12px", borderRadius: "8px", textDecoration: "none" }}>Approvals</Link>}
        {["upcoming", "cancelled", "completed"].map((s) => (
          <button key={s} onClick={() => { setTab(s); load(s); }} style={{ background: tab === s ? "#333" : "#111", color: "white", border: "1px solid #333", padding: "8px 12px", borderRadius: "8px" }}>{s}</button>
        ))}
      </div>
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {meetings.length === 0 ? <p style={{ color: "#666" }}>No {tab} meetings.</p> : meetings.map((m) => (
        <div key={m.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
          <h3 style={{ margin: "0 0 6px" }}>{m.title}</h3>
          <p style={{ margin: "0 0 6px", color: "#aaa", fontSize: "13px" }}>{m.date} · {m.time}</p>
          {isAdmin && <p style={{ margin: "0 0 10px", color: "#d5a943", fontSize: "13px" }}>Code: {m.join_code}</p>}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {m.status === "upcoming" && <Link href={`/join/${m.id}`} style={{ background: "#d5a943", color: "#111", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: 700 }}>Enter code</Link>}
            {isAdmin && m.status === "upcoming" && <Link href={`/meetings/edit?id=${m.id}`} style={{ background: "#222", color: "#d5a943", border: "1px solid #444", padding: "8px 12px", borderRadius: "6px", textDecoration: "none" }}>Edit</Link>}
            {isAdmin && m.status === "upcoming" && <button onClick={() => cancelMeeting(m.id)} style={{ background: "#3a1515", color: "#ff6b6b", border: "none", padding: "8px 12px", borderRadius: "6px" }}>Cancel</button>}
          </div>
        </div>
      ))}
    </main>
  );
}
