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
      <p style={{ color: "#aaa", maxWidth: "400px", lineHeight: "1.6" }}>
        One Fellowship. One Mission. One Voice.
      </p>
      <p style={{ marginTop: "40px", color: "#666", fontSize: "14px" }}>
        Phase 1 – Foundation in progress
      </p>
    </main>
  );
}
