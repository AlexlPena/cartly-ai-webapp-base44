import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, MessageSquare, List, Home, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "My Lists", icon: List, page: "Lists" },
  { name: "Cartly AI", icon: MessageSquare, page: "Chat" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-base tracking-tight">Cartly</span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = currentPageName === item.page;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}