import React, { useState } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

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

export default function AddItemForm({ onAdd, onSave, onCancel, initialData }) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || "");
  const [category, setCategory] = useState(initialData?.category || "other");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [expirationDate, setExpirationDate] = useState(initialData?.expiration_date || "");
  const [showMore, setShowMore] = useState(!!(initialData?.notes || initialData?.expiration_date));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const data = {
      name: name.trim(),
      quantity: quantity.trim() || undefined,
      category,
      notes: notes.trim() || undefined,
      expiration_date: expirationDate || undefined,
    };
    if (isEditing) {
      onSave(data);
    } else {
      onAdd(data);
    }
  };

  const selectedLabel = categories.find((c) => c.id === category)?.label || "Category";

  return (
    <>
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
          {/* Category button — opens Drawer on all screen sizes */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex items-center justify-between px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white hover:border-green-300 transition-all select-none"
          >
            <span>{selectedLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
          </button>
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
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {isEditing ? "Save Changes" : "Add item"}
            </button>
          </div>
        </div>
      </form>

      {/* Category Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Category</DrawerTitle>
          </DrawerHeader>
          <div className="pb-safe px-4 pb-6">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setCategory(c.id); setDrawerOpen(false); }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all select-none border ${
                    category === c.id
                      ? "bg-green-50 border-green-200 text-green-800 font-medium"
                      : "bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{c.label}</span>
                  {category === c.id && <Check className="w-4 h-4 text-green-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}