import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const categories = [
  { id: "produce", label: "🥦 Produce" },
  { id: "meat_seafood", label: "🥩 Meat & Seafood" },
  { id: "dairy_eggs", label: "🥛 Dairy & Eggs" },
  { id: "bakery", label: "🍞 Bakery" },
  { id: "pantry", label: "🫙 Pantry" },
  { id: "frozen", label: "🧊 Frozen" },
  { id: "beverages", label: "🧃 Beverages" },
  { id: "snacks", label: "🍿 Snacks" },
  { id: "household", label: "🧹 Household" },
  { id: "personal_care", label: "🧴 Personal Care" },
  { id: "other", label: "📦 Other" },
];

export default function AddItemForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("other");
  const [notes, setNotes] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity: quantity.trim() || undefined, category, notes: notes.trim() || undefined, expiration_date: expirationDate || undefined });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name…"
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
        />
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty (e.g. 2, 500g)"
          className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-green-300 transition-all"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-green-300 transition-all bg-white"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {showMore && (
        <div className="space-y-2 mb-3">
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)…"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 placeholder-gray-400 outline-none focus:border-green-300 transition-all"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 whitespace-nowrap">Expiry date:</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 outline-none focus:border-green-300 transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showMore ? "Less options" : "+ Notes & Expiry"}
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add item
        </button>
      </div>
    </form>
  );
}