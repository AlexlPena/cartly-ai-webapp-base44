import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageSquare, List, Zap, Leaf, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    desc: "Ask Cartly anything — meal ideas, diet tips, what to cook with what's in your fridge.",
    color: "green",
  },
  {
    icon: List,
    title: "Smart Lists",
    desc: "Organize items by category, check off as you shop, and keep multiple lists.",
    color: "blue",
  },
  {
    icon: Leaf,
    title: "Reduce Waste",
    desc: "Get suggestions that use what you already have and avoid buying things you'll toss.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Quick Meal Plans",
    desc: "Plan fast, practical meals around your groceries without the recipe overwhelm.",
    color: "amber",
  },
];

const colorMap = {
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

const prompts = [
  "High-protein keto breakfast ideas",
  "Budget meals for the week",
  "What to cook with chicken & rice",
  "Vegan grocery essentials",
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-green-100">
          <Sparkles className="w-3.5 h-3.5" />
          Your AI grocery companion
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
          Shop smarter with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
            Cartly AI
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Plan meals, build grocery lists, and reduce food waste — all through a simple, friendly chat.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={createPageUrl("Chat")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-2xl font-medium text-sm hover:bg-gray-800 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Cartly
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={createPageUrl("Lists")}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-7 py-3.5 rounded-2xl font-medium text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
          >
            <List className="w-4 h-4" />
            My Lists
          </Link>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="mb-20">
        <p className="text-center text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Try asking Cartly</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {prompts.map((p) => (
            <Link
              key={p}
              to={createPageUrl("Chat") + `?q=${encodeURIComponent(p)}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all shadow-sm"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-2xl ${colorMap[f.color]} flex items-center justify-center mb-4`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-10 text-center text-white shadow-xl">
        <ShoppingBag className="w-10 h-10 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">Ready to shop smarter?</h2>
        <p className="text-green-100 text-sm mb-6">Start a conversation and let Cartly do the heavy lifting.</p>
        <Link
          to={createPageUrl("Chat")}
          className="inline-flex items-center gap-2 bg-white text-green-700 px-7 py-3 rounded-2xl font-semibold text-sm hover:bg-green-50 transition-all"
        >
          Get started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}