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
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") router.push("/login");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      setMessage("Please fill title, date and time.");
      return;
    }

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const newMeeting = {
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      agenda: agenda.trim(),
      joinCode: code,
      createdAt: new Date().toISOString(),
      status: "upcoming"
    };

    const existing = JSON.parse(localStorage.getItem("hpf_meetings") || "[]");
    existing.unshift(newMeeting);
    localStorage.setItem("hpf_meetings", JSON.stringify(existing));
    setJoinCode(code);
    setMessage("Meeting saved. Share this code only with approved executives.");
  }

  if (joinCode) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#d5a943", marginBottom: "10px" }}>PRESIDENT JOIN CODE</div>
          <h1 style={{ fontSize: "40px", letterSpacing: "4px", margin: "8px 0 12px" }}>{joinCode}</h1>
          <p style={{ color: "#aaa", fontSize: "14px" }}>{message}</p>
          <p style={{ color: "#888", fontSize: "13px" }}>{title}<br />{date} · {time}</p>
          <Link href="/dashboard" style={{ display: "inline-block", marginTop: "18px", background: "#d5a943", color: "#111", padding: "12px 18px", borderRadius: "8px", textDecoration: "none", fontWeight: 700 }}>Go to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none", fontSize: "14px" }}>← Back to Dashboard</Link>
      </div>
      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>Schedule Meeting</h1>
      <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>A secret join code will appear after you save.</p>
      <form onSubmit={handleSubmit} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "25px", maxWidth: "500px" }}>
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>MEETING TITLE</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "16px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>DATE</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "16px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>TIME</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "16px", boxSizing: "border-box" }} />
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>AGENDA</label>
        <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={3} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "white", marginBottom: "16px", boxSizing: "border-box" }} />
        {message && <p style={{ color: "#ff6b6b" }}>{message}</p>}
        <button type="submit" style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>Schedule Meeting</button>
      </form>
    </main>
  );
}
