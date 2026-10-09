"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  status: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Profile[]>([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }
    const { data: me } = await supabase.from("profiles").select("role, status").eq("id", userData.user.id).maybeSingle();
    if (!me || me.status !== "approved" || !["admin", "president"].includes(me.role)) {
      setError("Only an administrator can open this page.");
      setReady(true);
      return;
    }
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data || []);
    setReady(true);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  async function setRole(id: string, role: string) {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  if (!ready) return <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</main>;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <Link href="/dashboard" style={{ color: "#d5a943", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: "24px" }}>Approve accounts</h1>
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {rows.map((p) => (
        <div key={p.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
          <strong>{p.full_name || "No name"}</strong>
          <p style={{ color: "#aaa", margin: "6px 0", fontSize: "13px" }}>{p.phone || "No phone"} · {p.role} · {p.status}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => setStatus(p.id, "approved")} style={{ background: "#14532d", color: "#bbf7d0", border: "none", padding: "8px 12px", borderRadius: "6px" }}>Approve</button>
            <button onClick={() => setStatus(p.id, "rejected")} style={{ background: "#3a1515", color: "#ff6b6b", border: "none", padding: "8px 12px", borderRadius: "6px" }}>Reject</button>
            <button onClick={() => setRole(p.id, "admin")} style={{ background: "#222", color: "#d5a943", border: "1px solid #444", padding: "8px 12px", borderRadius: "6px" }}>Make admin</button>
            <button onClick={() => setRole(p.id, "member")} style={{ background: "#222", color: "#fff", border: "1px solid #444", padding: "8px 12px", borderRadius: "6px" }}>Make member</button>
          </div>
        </div>
      ))}
    </main>
  );
                       }
