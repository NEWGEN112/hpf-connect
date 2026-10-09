"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    const { data, error: signError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), phone } }
    });
    if (signError || !data.user) {
      setSaving(false);
      setError(signError?.message || "Could not create account.");
      return;
    }
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: name.trim(),
      phone,
      role: "member",
      status: "pending"
    });
    setSaving(false);
    if (profileError) {
      setError(profileError.message);
      return;
    }
    setMessage("Account created. An administrator must approve you before you can sign in.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: "420px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943", marginBottom: "8px" }}>HPF CONNECT</div>
        <h1 style={{ margin: "0 0 8px", fontSize: "24px" }}>Create account</h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: 0 }}>Your account stays pending until an administrator approves it.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={{ width: "100%", marginBottom: "10px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%", marginBottom: "10px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={{ width: "100%", marginBottom: "10px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        {error && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</p>}
        {message && <p style={{ color: "#4ade80", fontSize: "13px" }}>{message}</p>}
        <button disabled={saving} style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>{saving ? "Creating..." : "Register"}</button>
        <p style={{ textAlign: "center", marginTop: "14px" }}><Link href="/login" style={{ color: "#d5a943" }}>Back to login</Link></p>
      </form>
    </main>
  );
      }
