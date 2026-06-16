import { C } from "../theme";

// HD Systems wordmark logo
export default function Logo({ size = "md" }) {
  const big = size === "lg";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: big ? 20 : 16 }}>
      <span style={{ background: C.primary, color: "#fff", fontWeight: 700, borderRadius: 6, padding: big ? "4px 10px" : "3px 8px" }}>HD</span>
      <span style={{ color: C.text, fontWeight: 600, marginLeft: 6 }}>Systems</span>
    </span>
  );
}
