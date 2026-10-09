"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("HPF Executive Meeting");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [agenda, setAgenda] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") router.push("/login");
  }, [router]);

  function makeCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      setMessage("Please fill title, date and time.");
      return;
    }

    const joinCode = makeCode();
    const newMeeting = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      agenda: agenda.trim(),
      joinCode,
      createdAt: new Date().toISOString(),
      status: "upcoming"
    };

    const existing = JSON.parse(localStorage.getItem("hpf_meetings") || "[]");
    existing.unshift(newMeeting);
    localStorage.setItem("hpf_meetings", JSON.stringify(existing));
    localStorage.setItem("last_join_code", joinCode);
    localStorage.setItem("last_meeting_id", newMeeting.id);

    setMessage("Meeting scheduled. Join code: " + joinCode);
    setTimeout(() => router.push("/dashboard"), 1600);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none", fontSize: "14px" }}>← Back to Dashboard</Link>
      </div>
      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>Schedule Meeting</h1>
      <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>
        A secret join code will be created. Share it only with approved executives.
      </p>
      <form onSubmit={handleSubmit} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "25px", maxWidth: "500px" }}>
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>MEETING TITLE</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "18px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>DATE</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "18px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>TIME</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "18px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>AGENDA (optional)</label>
        <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={4} placeholder="What will be discussed..." style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "20px", boxSizing: "border-box" }} />
        {message && <p style={{ color: "#4ade80", marginBottom: "15px", fontSize: "14px" }}>{message}</p>}
        <button type="submit" style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700, fontSize: "15px" }}>Schedule Meeting</button>
      </form>
    </main>
  );
}
