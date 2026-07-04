import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
          <div className="glass-panel max-w-md rounded-2xl p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-400" />
            <h1 className="text-xl font-semibold text-white">Something went sideways</h1>
            <p className="mt-2 text-sm text-slate-400">
              An unexpected error interrupted this page. Even the most useless quiz needs to work
              some of the time.
            </p>
            <button onClick={this.handleReset} className="btn-primary mt-6 w-full">
              Back to safety
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
