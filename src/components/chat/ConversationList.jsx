import React from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ConversationList({ conversations, activeId, onSelect, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex-1 p-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No conversations yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1">
      {conversations.map((conv) => {
        const active = conv.id === activeId;
        const name = conv.metadata?.name || "New Chat";
        const date = conv.created_date ? format(new Date(conv.created_date), "MMM d") : "";

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-xl group flex items-start justify-between gap-2 transition-all",
              active ? "bg-green-50 text-green-800" : "hover:bg-gray-50 text-gray-600"
            )}
          >
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-medium truncate", active ? "text-green-800" : "text-gray-700")}>
                {name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{date}</p>
            </div>
            <button
              onClick={(e) => onDelete(conv.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </button>
        );
      })}
    </div>
  );
}