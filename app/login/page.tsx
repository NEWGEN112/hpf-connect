"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const { data, error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (signError || !data.user) {
      setSaving(false);
      setError(signError?.message || "Login failed.");
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("status, role, full_name")
      .eq("id", data.user.id)
      .maybeSingle();
    setSaving(false);
    if (profileError || !profile) {
      setError("Profile not found. Ask an administrator.");
      await supabase.auth.signOut();
      return;
    }
    if (profile.status !== "approved") {
      setError("Your account is still pending approval.");
      await supabase.auth.signOut();
      return;
    }
    localStorage.setItem("hpf_name", profile.full_name || "");
    localStorage.setItem("hpf_role", profile.role || "member");
    router.push("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "420px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#d5a943", marginBottom: "8px" }}>HOSTEL PRAYER FELLOWSHIP</div>
        <h1 style={{ margin: "0 0 8px", fontSize: "26px" }}>HPF Connect</h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: 0 }}>Sign in with your approved account.</p>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%", marginBottom: "10px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: "100%", marginBottom: "12px", padding: "12px", background: "#1a1a1a", color: "white", border: "1px solid #333", borderRadius: "8px", boxSizing: "border-box" }} />
        {error && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</p>}
        <button disabled={saving} style={{ width: "100%", background: "#d5a943", color: "#111", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700 }}>{saving ? "Signing in..." : "Sign in"}</button>
        <p style={{ textAlign: "center", marginTop: "14px" }}><Link href="/register" style={{ color: "#d5a943" }}>Create an account</Link></p>
      </form>
    </main>
  );
                                                                                                                 }
