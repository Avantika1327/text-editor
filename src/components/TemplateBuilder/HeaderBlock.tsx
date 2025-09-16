export default function HeaderBlock() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        // padding: "20px",
        background: "#f0f0f0",
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Logo on left */}
      <img
        src="https://via.placeholder.com/100"
        alt="Logo"
        style={{ marginRight: "450px" }}
      />

      {/* Company details on right */}
      <div style={{ textAlign: "left" }}>
        <h2>{"{{companyName}}"}</h2>
        <p>{"{{address}}"}</p>
        <p>{"{{email}}"}</p>
        <p>{"{{phone}}"}</p>
      </div>
    </header>
  );
}
