import { C } from "../theme";

export default function Logo({ size = "md" }) {
  const big = size === "lg";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: big ? 20 : 16 }}>
      <span style={{ background: C.gradient, color: "#fff", fontWeight: 700, borderRadius: 6, padding: big ? "4px 10px" : "3px 8px" }}>Ask</span>
      <span style={{ color: C.text, fontWeight: 600, marginLeft: 2 }}>ora</span>
    </span>
  );
}
