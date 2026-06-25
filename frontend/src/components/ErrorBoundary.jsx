import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Lumo crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
          <h1 className="text-xl font-semibold text-ink">Something went wrong</h1>
          <p className="max-w-sm text-sm text-muted">
            An unexpected error occurred. Reloading usually fixes it.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload Lumo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
