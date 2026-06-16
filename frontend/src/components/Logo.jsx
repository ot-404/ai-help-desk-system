import { C } from "../theme";

// HD Systems wordmark logo
export default function Logo({ size = "md" }) {
  const big = size === "lg";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: big ? 22 : 18 }}>
      <span style={{ background: C.primary, color: "#fff", fontWeight: 800, borderRadius: 6, padding: big ? "5px 12px" : "4px 10px" }}>HD</span>
      <span style={{ color: C.primary, fontWeight: 700, marginLeft: 4 }}>Systems</span>
    </span>
  );
}
