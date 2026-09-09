/* eslint-disable react-refresh/only-export-components */
import { createRouter, useRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { routeTree } from "./routeTree.gen";
import { resetKnownCorruptedState } from "@/lib/browser-safe";
import { recordRuntimeError } from "@/lib/runtime-diagnostics";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { recordRuntimeError("react", error); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4"><div className="max-w-md text-center"><p className="mono text-[10px] text-[var(--color-acc-blue)]">/// ERROR</p><h1 className="display text-3xl mt-3 text-metal">Something went wrong</h1>{import.meta.env.DEV&&error.message&&<pre className="mt-4 max-h-40 overflow-auto rounded-md bg-white/5 p-3 text-left font-mono text-xs text-red-400">{error.message}</pre>}<div className="mt-6 flex items-center justify-center gap-3"><button type="button" onClick={()=>{resetKnownCorruptedState();router.options.context.queryClient.clear();router.invalidate();reset();}} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-acc-blue)] px-4 py-2 text-sm font-medium text-black focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]">Try again</button><a href="/" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]">Go home</a></div></div></div>;
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 120_000, gcTime: 15*60_000, retry: 1, refetchOnWindowFocus: false, refetchOnReconnect: true, throwOnError: false },
      mutations: { retry: 0, throwOnError: false },
    },
  });
  return createRouter({ routeTree, context:{queryClient}, scrollRestoration:true, defaultPreloadStaleTime:30_000, defaultErrorComponent:DefaultErrorComponent });
};

declare module "@tanstack/react-router" { interface Register { router: ReturnType<typeof getRouter>; } }
