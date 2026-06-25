"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle } from "lucide-react";

export function DownloadButton({ appId, appName }: { appId: string; appName: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handleDownload() {
    setState("loading");
    window.location.href = `/api/download/${appId}`;
    setTimeout(() => setState("done"), 2000);
    setTimeout(() => setState("idle"), 5000);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={state === "loading"}
      className={`w-full font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all text-sm shadow-lg active:scale-95 ${
        state === "done"
          ? "bg-green-500 text-white shadow-green-500/30"
          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
      } disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {state === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
      {state === "done" && <CheckCircle className="w-5 h-5" />}
      {state === "idle" && <Download className="w-5 h-5" />}

      {state === "loading" ? "Preparing Download..." : state === "done" ? "Download Started!" : `Download ${appName}`}
    </button>
  );
}
