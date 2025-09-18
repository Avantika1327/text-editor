export default function FooterBlock() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        background: "#f0f0f0",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>© {"{{year}}"} {"{{companyName}}"} Pvt Ltd. All rights reserved.</p>
    </footer>
  );
}
