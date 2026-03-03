import React from "react";
import { X, CheckCheck, Trash2, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeStyles = {
  expiration_critical: "bg-red-50 border-red-100",
  expiration_warning: "bg-amber-50 border-amber-100",
  info: "bg-blue-50 border-blue-100",
};

const typeDot = {
  expiration_critical: "bg-red-500",
  expiration_warning: "bg-amber-400",
  info: "bg-blue-400",
};

export default function NotificationPanel({
  notifications,
  onMarkAllRead,
  onMarkOneRead,
  onDelete,
  onClose,
}) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Bell className="w-8 h-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && onMarkOneRead(n.id)}
              className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all ${
                !n.is_read ? typeStyles[n.type] || typeStyles.info : ""
              }`}
            >
              <div className="mt-1.5 shrink-0">
                <div
                  className={`w-2 h-2 rounded-full ${
                    !n.is_read ? typeDot[n.type] || typeDot.info : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.is_read ? "text-gray-500" : "text-gray-900"}`}>
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {formatDistanceToNow(new Date(n.created_date), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n.id);
                }}
                className="shrink-0 p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all self-start mt-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}