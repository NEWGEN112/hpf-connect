import Link from "next/link";

export default function Home() {
  return (
    <main style={{ 
      minHeight: "100vh", 
      background: "#0a0a0a", 
      color: "white", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#d5a943", marginBottom: "15px" }}>
        HOSTEL PRAYER FELLOWSHIP
      </div>
      
      <h1 style={{ fontSize: "42px", margin: "0 0 10px", fontWeight: "bold" }}>
        HPF CONNECT
      </h1>
      
      <p style={{ color: "#aaa", maxWidth: "400px", lineHeight: "1.6", marginBottom: "40px" }}>
        One Fellowship. One Mission. One Voice.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "280px" }}>
        <Link href="/login" style={{
          background: "#d5a943",
          color: "#111",
          padding: "14px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "700",
          fontSize: "15px"
        }}>
          Login as Executive
        </Link>

        <Link href="/dashboard" style={{
          background: "transparent",
          color: "#d5a943",
          padding: "14px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "14px",
          border: "1px solid #d5a943"
        }}>
          View Dashboard (Demo)
        </Link>
      </div>

      <p style={{ marginTop: "50px", color: "#555", fontSize: "13px" }}>
        Phase 1 – Foundation in progress
      </p>
    </main>
  );
}
