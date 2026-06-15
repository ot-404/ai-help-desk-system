import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600, margin: "80px auto" }}>
          <h2 style={{ color: "#c53030" }}>Something went wrong</h2>
          <pre style={{
            background: "#fff5f5", border: "1px solid #fed7d7",
            borderRadius: 8, padding: 16, fontSize: 13,
            whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#742a2a",
          }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
