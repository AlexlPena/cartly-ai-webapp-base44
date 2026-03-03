import React from "react";
import { Link } from "react-router-dom";
import { Home, List, MessageSquare } from "lucide-react";
import { createPageUrl } from "@/utils";

const navItems = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "Lists", icon: List, page: "Lists" },
  { name: "AI Chat", icon: MessageSquare, page: "Chat" },
];

export default function BottomNav({ currentPageName }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const active = currentPageName === item.page;
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className="flex flex-col items-center gap-1 px-5 py-1 rounded-xl transition-all select-none"
            >
              <item.icon
                className={`w-5 h-5 ${active ? "text-green-600" : "text-gray-400"}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium ${active ? "text-green-600" : "text-gray-400"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}