"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  agenda: string | null;
  status: string;
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
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMeeting() {
      try {
        // Check whether the user is signed in.
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        // Check the user's approval status and role.
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (
          profileError ||
          !profile ||
          profile.status !== "approved" ||
          !["admin", "president"].includes(profile.role)
        ) {
          router.replace("/dashboard");
          return;
        }

        if (!active) return;

        setAuthorized(true);

        if (!id) {
          setMessage("Meeting ID is missing.");
          setReady(true);
          return;
        }

        // Load the meeting from the shared Supabase database.
        const { data: meeting, error: meetingError } = await supabase
          .from("meetings")
          .select("id, title, date, time, agenda, status")
          .eq("id", id)
          .maybeSingle();

        if (!active) return;

        if (meetingError) {
          setMessage("Could not load meeting: " + meetingError.message);
          setReady(true);
          return;
        }

        if (!meeting) {
          setMessage("Meeting not found.");
          setReady(true);
          return;
        }

        const savedMeeting = meeting as Meeting;

        if (savedMeeting.status !== "upcoming") {
          setMessage(
            "Only upcoming meetings can be edited. " +
              "Cancelled or completed meetings cannot be changed here."
          );
          setReady(true);
          return;
        }

        setTitle(savedMeeting.title || "");
        setDate(savedMeeting.date || "");
        setTime(savedMeeting.time || "");
        setAgenda(savedMeeting.agenda || "");
        setReady(true);
      } catch {
        if (active) {
          setMessage("Something went wrong while loading the meeting.");
          setReady(true);
        }
      }
    }

    loadMeeting();

    return () => {
      active = false;
    };
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!id) {
      setMessage("Meeting ID is missing.");
      return;
    }

    if (!title.trim() || !date || !time) {
      setMessage("Please fill in the meeting title, date and time.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      // Confirm that the user is still signed in.
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      // Verify approval and role again before saving.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (
        profileError ||
        !profile ||
        profile.status !== "approved" ||
        !["admin", "president"].includes(profile.role)
      ) {
        setMessage("You are not authorized to edit this meeting.");
        return;
      }

      // Confirm that the meeting still exists and is upcoming.
      const { data: existingMeeting, error: checkError } = await supabase
        .from("meetings")
        .select("id, status")
        .eq("id", id)
        .maybeSingle();

      if (checkError) {
        setMessage("Could not verify meeting: " + checkError.message);
        return;
      }

      if (!existingMeeting) {
        setMessage("Meeting not found.");
        return;
      }

      if (existingMeeting.status !== "upcoming") {
        setMessage("This meeting can no longer be edited.");
        return;
      }

      // Save the changes to Supabase.
      const { data: updatedMeeting, error: updateError } = await supabase
        .from("meetings")
        .update({
          title: title.trim(),
          date,
          time,
          agenda: agenda.trim(),
        })
        .eq("id", id)
        .eq("status", "upcoming")
        .select("id")
        .maybeSingle();

      if (updateError) {
        setMessage("Could not save changes: " + updateError.message);
        return;
      }

      if (!updatedMeeting) {
        setMessage(
          "The meeting was not updated. Please check your database permissions."
        );
        return;
      }

      setMessage("Meeting updated successfully!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white",
    marginBottom: "18px",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  if (!ready) {
    return (
      <main
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading meeting...
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: "30px" }}>
        <Link
          href="/dashboard"
          style={{
            color: "#d5a943",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: "550px", margin: "0 auto" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#d5a943",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}
        >
          HPF CONNECT
        </div>

        <h1 style={{ fontSize: "26px", marginBottom: "8px" }}>
          Edit Meeting
        </h1>

        <p
          style={{
            color: "#888",
            marginBottom: "28px",
            fontSize: "14px",
          }}
        >
          Update meeting details for the HPF team.
        </p>

        {!authorized ? (
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              color: "#ff6b6b",
            }}
          >
            {message || "You are not authorized to edit this meeting."}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "22px",
            }}
          >
            <label
              htmlFor="title"
              style={{
                display: "block",
                fontSize: "12px",
                color: "#d5a943",
                marginBottom: "6px",
              }}
            >
              MEETING TITLE
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              required
              style={inputStyle}
            />

            <label
              htmlFor="date"
              style={{
                display: "block",
                fontSize: "12px",
                color: "#d5a943",
                marginBottom: "6px",
              }}
            >
              DATE
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />

            <label
              htmlFor="time"
              style={{
                display: "block",
                fontSize: "12px",
                color: "#d5a943",
                marginBottom: "6px",
              }}
            >
              TIME
            </label>

            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              style={inputStyle}
            />

            <label
              htmlFor="agenda"
              style={{
                display: "block",
                fontSize: "12px",
                color: "#d5a943",
                marginBottom: "6px",
              }}
            >
              AGENDA (OPTIONAL)
            </label>

            <textarea
              id="agenda"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={5}
              placeholder="What will be discussed?"
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />

            {message && (
              <div
                role="status"
                style={{
                  color: message.includes("successfully")
                    ? "#4ade80"
                    : "#ff6b6b",
                  background: "#1a1a1a",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                background: saving ? "#8c702c" : "#d5a943",
                color: "#111",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

            <Link
              href="/dashboard"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "18px",
                color: "#aaa",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Cancel and return
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}

export default function EditMeetingPage() {
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
            justifyContent: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Loading...
        </main>
      }
    >
      <EditMeetingForm />
    </Suspense>
  );
        }
