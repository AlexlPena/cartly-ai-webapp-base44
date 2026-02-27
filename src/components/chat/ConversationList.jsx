import React, { useState } from "react";
import { MessageSquare, Trash2, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ConversationList({ conversations, activeId, onSelect, onDelete, onRename, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
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

        const isEditing = editingId === conv.id;

        const startEdit = (e) => {
          e.stopPropagation();
          setEditingId(conv.id);
          setEditValue(name);
        };

        const saveEdit = (e) => {
          e.stopPropagation();
          if (editValue.trim()) onRename(conv.id, editValue.trim());
          setEditingId(null);
        };

        return (
          <div
            key={conv.id}
            onClick={() => !isEditing && onSelect(conv)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-xl group flex items-start justify-between gap-2 transition-all cursor-pointer",
              active ? "bg-green-50 text-green-800" : "hover:bg-gray-50 text-gray-600"
            )}
          >
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(e); if (e.key === "Escape") setEditingId(null); }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-sm font-medium bg-white border border-green-300 rounded-lg px-2 py-0.5 outline-none text-gray-800"
                />
              ) : (
                <p className={cn("text-sm font-medium truncate", active ? "text-green-800" : "text-gray-700")}>
                  {name}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{date}</p>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
              {isEditing ? (
                <button onClick={saveEdit} className="p-1 rounded-lg hover:bg-green-50 text-green-500 transition-all">
                  <Check className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={startEdit} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => onDelete(conv.id, e)}
                className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}