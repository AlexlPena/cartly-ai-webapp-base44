import React, { useState } from "react";
import { X } from "lucide-react";

const colors = [
  { id: "green", label: "Green", bg: "bg-green-400" },
  { id: "blue", label: "Blue", bg: "bg-blue-400" },
  { id: "orange", label: "Orange", bg: "bg-orange-400" },
  { id: "purple", label: "Purple", bg: "bg-purple-400" },
  { id: "pink", label: "Pink", bg: "bg-pink-400" },
  { id: "yellow", label: "Yellow", bg: "bg-yellow-400" },
];

export default function CreateListModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("green");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), color);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900 text-lg">New list</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">List name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekly groceries"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all ${color === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Create list
          </button>
        </form>
      </div>
    </div>
  );
}