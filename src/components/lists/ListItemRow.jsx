import React from "react";
import { Trash2, Check, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ListItemRow({ item, onToggle, onDelete }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border group transition-all",
        item.is_checked ? "border-gray-100 opacity-60" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      )}
    >
      <button
        onClick={() => onToggle(item)}
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
          item.is_checked
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-400"
        )}
      >
        {item.is_checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium text-gray-800", item.is_checked && "line-through text-gray-400")}>
          {item.name}
        </p>
        {(item.quantity || item.notes || item.expiration_date) && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
            {item.quantity}{item.quantity && item.notes ? " · " : ""}{item.notes}
            {item.expiration_date && (
              <span className="flex items-center gap-1 text-amber-500">
                <CalendarClock className="w-3 h-3" />
                Exp: {new Date(item.expiration_date + "T00:00:00").toLocaleDateString()}
              </span>
            )}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}