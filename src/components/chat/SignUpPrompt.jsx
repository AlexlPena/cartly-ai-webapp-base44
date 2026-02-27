import React from "react";
import { ShoppingCart, Sparkles, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SignUpPrompt({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          You're on a roll! 🎉
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
          Create a free account to save your grocery lists, chat history, and get the most out of Cartly AI.
        </p>

        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all mb-3"
        >
          Create free account
        </button>
        <button
          onClick={onDismiss}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}