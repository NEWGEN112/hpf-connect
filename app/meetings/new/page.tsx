"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function NewMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("HPF Executive Meeting");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [agenda, setAgenda] = useState("");
  const [message, setMessage] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("hpf_logged_in") !== "true") router.push("/login");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      setMessage("Please fill title, date and time.");
      return;
    }
    setSaving(true);
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const row = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      agenda: agenda.trim(),
      join_code: code,
      status: "upcoming"
    };
    const { error } = await supabase.from("meetings").insert(row);
    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setJoinCode(code);
  }

  if (joinCode) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#d5a943" }}>SAVED FOR EVERY PHONE</div>
          <h1 style={{ fontSize: "40px", letterSpacing: "4px" }}>{joinCode}</h1>
          <p style={{ color: "#aaa" }}>{title}<br />{date} · {time}</p>
          <p style={{ color: "#888", fontSize: "13px" }}>Other executives will see this meeting when they refresh the Dashboard.</p>
          <Link href="/dashboard" style={{ display: "inline-block", marginTop: "16px", background: "#d5a943", color: "#111", padding: "12px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>Go to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none" }}>← Back</Link>
      <h1>Schedule Meeting</h1>
      <p style={{ color: "#888" }}>This meeting will appear on every executive phone.</p>
      <form onSubmit={handleSubmit} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "20px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={3} placeholder="Agenda" style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        {message && <p style={{ color: "#ff6b6b" }}>{message}</p>}
        <button disabled={saving} style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>{saving ? "Saving..." : "Schedule Meeting"}</button>
      </form>
    </main>
  );
}
