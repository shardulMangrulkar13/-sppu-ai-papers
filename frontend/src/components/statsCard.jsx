function StatsCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        borderTop: `6px solid ${color}`,
        transition: "0.3s",
      }}
    >
      <h3
        style={{
          color: "#555",
          fontSize: "18px",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: color,
          fontSize: "40px",
          fontWeight: "bold",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;