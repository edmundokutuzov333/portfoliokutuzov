import { Component, type ErrorInfo, type ReactNode } from "react";
import { recordRuntimeError } from "@/lib/runtime-diagnostics";

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    recordRuntimeError("react", new Error(`${error.message}\n${info.componentStack}`));
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return <AppErrorFallback error={this.state.error} onReset={this.reset} />;
  }
}

export function AppErrorFallback({ error, onReset }: { error?: Error; onReset?: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-bg)] px-5 text-[var(--color-text)]">
      <div className="max-w-lg text-center">
        <p className="mono text-[10px] text-[var(--color-acc-blue)]">/// RUNTIME RECOVERY</p>
        <h1 className="display mt-4 text-4xl text-metal">The interface recovered.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          A rendering error was isolated so the preview does not go blank. You can retry the render or reload the page.
        </p>
        {import.meta.env.DEV && error?.message && (
          <pre className="mt-5 max-h-44 overflow-auto rounded-md border border-white/10 bg-white/[0.04] p-3 text-left font-mono text-xs text-red-300">
            {error.message}
          </pre>
        )}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-acc-blue)] px-5 py-3 text-sm font-semibold text-black"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm text-slate-200 hover:border-white/40"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
