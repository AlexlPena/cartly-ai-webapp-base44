import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || "Action";
  const status = toolCall?.status || "pending";
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try { return typeof results === "string" ? JSON.parse(results) : results; }
    catch { return results; }
  })();

  const isError = results && (
    (typeof results === "string" && /error|failed/i.test(results)) ||
    (parsedResults?.success === false)
  );

  const statusConfig = {
    pending: { icon: Clock, color: "text-gray-400", text: "Pending" },
    running: { icon: Loader2, color: "text-green-500", text: "Running...", spin: true },
    in_progress: { icon: Loader2, color: "text-green-500", text: "Running...", spin: true },
    completed: isError
      ? { icon: AlertCircle, color: "text-red-500", text: "Failed" }
      : { icon: CheckCircle2, color: "text-green-600", text: "Done" },
    success: { icon: CheckCircle2, color: "text-green-600", text: "Done" },
    failed: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
    error: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
  }[status] || { icon: Zap, color: "text-gray-500", text: "" };

  const Icon = statusConfig.icon;
  const formattedName = name.split(".").reverse().join(" ").toLowerCase();

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
          "hover:bg-gray-50",
          expanded ? "bg-gray-50 border-gray-300" : "bg-white border-gray-200"
        )}
      >
        <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
        <span className="text-gray-600 capitalize">{formattedName}</span>
        {statusConfig.text && (
          <span className={cn("text-gray-400", isError && "text-red-500")}>· {statusConfig.text}</span>
        )}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight className={cn("h-3 w-3 text-gray-400 transition-transform ml-auto", expanded && "rotate-90")} />
        )}
      </button>

      {expanded && !statusConfig.spin && (
        <div className="mt-1.5 ml-3 pl-3 border-l-2 border-gray-200 space-y-2">
          {toolCall.arguments_string && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Parameters</div>
              <pre className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 whitespace-pre-wrap">
                {(() => { try { return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2); } catch { return toolCall.arguments_string; } })()}
              </pre>
            </div>
          )}
          {parsedResults && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Result</div>
              <pre className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-auto">
                {typeof parsedResults === "object" ? JSON.stringify(parsedResults, null, 2) : parsedResults}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 max-w-3xl mx-auto", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <span className="text-white text-xs font-bold">C</span>
        </div>
      )}
      <div className={cn("max-w-[80%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser
                ? "bg-gray-900 text-white rounded-br-sm"
                : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"
            )}
          >
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-sm prose-gray max-w-none"
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  h1: ({ children }) => <h1 className="text-base font-semibold text-gray-900 mb-1.5 mt-3 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-semibold text-gray-900 mb-1.5 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-700 mb-1 mt-2 first:mt-0">{children}</h3>,
                  code: ({ children }) => <code className="px-1 py-0.5 rounded bg-gray-100 text-green-700 text-xs font-mono">{children}</code>,
                  a: ({ children, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">{children}</a>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="space-y-1 mt-1">
            {message.tool_calls.map((tc, i) => <FunctionDisplay key={i} toolCall={tc} />)}
          </div>
        )}
      </div>
    </div>
  );
}