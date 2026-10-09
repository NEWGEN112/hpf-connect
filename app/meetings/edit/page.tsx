"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  agenda: string;
  status: string;
  createdAt?: string;
};

function EditMeetingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("hpf_logged_in");
    if (loggedIn !== "true") {
      router.push("/login");
      return;
    }

    if (!id) {
      setMessage("Meeting not found.");
      setReady(true);
      return;
    }

    const meetings: Meeting[] = JSON.parse(
      localStorage.getItem("hpf_meetings") || "[]"
    );
    const meeting = meetings.find((m) => m.id === id);

    if (!meeting) {
      setMessage("Meeting not found.");
      setReady(true);
      return;
    }

    setTitle(meeting.title);
    setDate(meeting.date);
    setTime(meeting.time);
    setAgenda(meeting.agenda || "");
    setReady(true);
  }, [id, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    if (!title.trim() || !date || !time) {
      setMessage("Please fill title, date and time.");
      return;
    }

    const meetings: Meeting[] = JSON.parse(
      localStorage.getItem("hpf_meetings") || "[]"
    );

    const updated = meetings.map((m) =>
      m.id === id
        ? {
            ...m,
            title: title.trim(),
            date,
            time,
            agenda: agenda.trim(),
          }
        : m
    );

    localStorage.setItem("hpf_meetings", JSON.stringify(updated));
    setMessage("Meeting updated successfully!");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  if (!ready) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        Loading...
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{ marginBottom: "30px" }}>
        <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none", fontSize: "14px" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>
        Edit Meeting
      </h1>
      <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>
        Update the meeting details
      </p>

      <form onSubmit={handleSubmit} style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "25px",
        maxWidth: "500px"
      }}>
        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>
          MEETING TITLE
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            marginBottom: "18px",
            boxSizing: "border-box"
          }}
        />

        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>
          DATE
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            marginBottom: "18px",
            boxSizing: "border-box"
          }}
        />

        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>
          TIME
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            marginBottom: "18px",
            boxSizing: "border-box"
          }}
        />

        <label style={{ display: "block", fontSize: "12px", color: "#d5a943", marginBottom: "6px" }}>
          AGENDA (optional)
        </label>
        <textarea
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          rows={4}
          placeholder="What will be discussed..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            marginBottom: "20px",
            boxSizing: "border-box",
            resize: "vertical"
          }}
        />

        {message && (
          <p style={{
            color: message.includes("successfully") ? "#4ade80" : "#ff6b6b",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#d5a943",
            color: "#111",
            border: "none",
            padding: "14px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

export default function EditMeetingPage() {
  return (
    <Suspense fallback={
      <main style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        Loading...
      </main>
    }>
      <EditMeetingForm />
    </Suspense>
  );
}
