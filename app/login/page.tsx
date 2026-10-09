export default function LoginPage() {
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
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "400px", 
        width: "100%", 
        background: "#111", 
        border: "1px solid #2a2a2a", 
        borderRadius: "16px", 
        padding: "40px 30px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#d5a943", marginBottom: "12px" }}>
          HOSTEL PRAYER FELLOWSHIP
        </div>
        
        <h1 style={{ fontSize: "32px", margin: "0 0 8px", fontWeight: "bold" }}>
          HPF CONNECT
        </h1>
        
        <p style={{ color: "#888", marginBottom: "35px", fontSize: "14px" }}>
          Private Executive Platform
        </p>

        <button style={{
          width: "100%",
          background: "#fff",
          color: "#111",
          border: "none",
          padding: "14px",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>G</span>
          Continue with Google
        </button>

        <p style={{ color: "#555", fontSize: "12px", marginTop: "25px" }}>
          Only authorized HPF executives can access this platform.
        </p>
      </div>
    </main>
  );
}
