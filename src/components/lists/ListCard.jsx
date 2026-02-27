import React from "react";
import { Trash2, CheckSquare, ShoppingCart } from "lucide-react";

const colorMap = {
  green: "bg-green-50 border-green-100",
  blue: "bg-blue-50 border-blue-100",
  orange: "bg-orange-50 border-orange-100",
  purple: "bg-purple-50 border-purple-100",
  pink: "bg-pink-50 border-pink-100",
  yellow: "bg-yellow-50 border-yellow-100",
};

const dotMap = {
  green: "bg-green-400",
  blue: "bg-blue-400",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  pink: "bg-pink-400",
  yellow: "bg-yellow-400",
};

export default function ListCard({ list, onClick, onDelete }) {
  const progress =
    list.total_items > 0
      ? Math.round((list.completed_items / list.total_items) * 100)
      : 0;
  const color = list.color || "green";

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-3xl border p-6 cursor-pointer hover:shadow-md transition-all ${colorMap[color] || colorMap.green}`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${dotMap[color] || dotMap.green}`} />
        <ShoppingCart className="w-4 h-4 text-gray-400" />
      </div>

      <h3 className="font-semibold text-gray-900 text-base mb-1 pr-6">{list.name}</h3>
      {list.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{list.description}</p>
      )}

      <div className="mt-auto pt-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>{list.completed_items || 0}/{list.total_items || 0} items</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}