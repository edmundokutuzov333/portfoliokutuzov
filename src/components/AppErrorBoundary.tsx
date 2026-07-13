import { Component, type ErrorInfo, type ReactNode } from "react";
import { resetKnownCorruptedState, safeReload } from "@/lib/browser-safe";
import { recordRuntimeError } from "@/lib/runtime-diagnostics";

type Props = {
  children: ReactNode;
  onReset?: () => void;
  label?: string;
  minimal?: boolean;
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
    resetKnownCorruptedState();
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.minimal) {
      return <ComponentErrorFallback label={this.props.label} error={this.state.error} onReset={this.reset} />;
    }
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
              safeReload();
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

function ComponentErrorFallback({
  label = "component",
  error,
  onReset,
}: {
  label?: string;
  error?: Error;
  onReset?: () => void;
}) {
  return (
    <div className="relative z-10 rounded-md border border-red-300/20 bg-red-950/20 p-4 text-sm text-red-100">
      <div className="mono text-[10px] text-red-300">/// ISOLATED ERROR</div>
      <p className="mt-2 text-slate-200">{label} failed to render and was isolated.</p>
      {import.meta.env.DEV && error?.message && (
        <pre className="mt-3 max-h-28 overflow-auto rounded bg-black/20 p-2 font-mono text-xs text-red-200">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-3 inline-flex rounded-full border border-red-200/25 px-3 py-1.5 text-xs text-red-100 hover:border-red-100/60"
      >
        Retry
      </button>
    </div>
  );
}
