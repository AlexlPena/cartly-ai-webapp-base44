import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Plus, Trash2, Check, ShoppingBag } from "lucide-react";
import ListItemRow from "@/components/lists/ListItemRow";
import AddItemForm from "@/components/lists/AddItemForm";

export default function ListDetail({ list, onBack, onDelete, onUpdate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(list.name);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    loadItems();
  }, [list.id]);

  const loadItems = async () => {
    setLoading(true);
    const data = await base44.entities.ListItem.filter({ list_id: list.id }, "category");
    setItems(data || []);
    setLoading(false);
    syncCounts(data || []);
  };

  const syncCounts = async (itemList) => {
    const total = itemList.length;
    const completed = itemList.filter((i) => i.is_checked).length;
    if (list.total_items !== total || list.completed_items !== completed) {
      const updated = await base44.entities.List.update(list.id, { total_items: total, completed_items: completed });
      onUpdate(updated);
    }
  };

  const addItem = async (data) => {
    const item = await base44.entities.ListItem.create({ ...data, list_id: list.id, is_checked: false });
    const updated = [...items, item];
    setItems(updated);
    syncCounts(updated);
    setShowAdd(false);
  };

  const toggleItem = async (item) => {
    const updated_item = await base44.entities.ListItem.update(item.id, { is_checked: !item.is_checked });
    const updated = items.map((i) => i.id === item.id ? updated_item : i);
    setItems(updated);
    syncCounts(updated);
  };

  const deleteItem = async (itemId) => {
    await base44.entities.ListItem.delete(itemId);
    const updated = items.filter((i) => i.id !== itemId);
    setItems(updated);
    syncCounts(updated);
  };

  const updateItem = async (itemId, data) => {
    const updated_item = await base44.entities.ListItem.update(itemId, data);
    const updated = items.map((i) => i.id === itemId ? updated_item : i);
    setItems(updated);
    setEditingItemId(null);
  };

  const saveName = async () => {
    if (!nameVal.trim() || nameVal === list.name) { setEditingName(false); return; }
    const updated = await base44.entities.List.update(list.id, { name: nameVal.trim() });
    onUpdate(updated);
    setEditingName(false);
  };

  const categoryOrder = ["produce", "meat_seafood", "dairy_eggs", "bakery", "pantry", "frozen", "beverages", "snacks", "household", "personal_care", "other"];
  const grouped = categoryOrder.reduce((acc, cat) => {
    const catItems = items.filter((i) => (i.category || "other") === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  const categoryLabels = {
    produce: "🥦 Produce", meat_seafood: "🥩 Meat & Seafood", dairy_eggs: "🥛 Dairy & Eggs",
    bakery: "🍞 Bakery", pantry: "🫙 Pantry", frozen: "🧊 Frozen", beverages: "🧃 Beverages",
    snacks: "🍿 Snacks", household: "🧹 Household", personal_care: "🧴 Personal Care", other: "📦 Other",
  };

  const progress = items.length > 0 ? Math.round((items.filter((i) => i.is_checked).length / items.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          {editingName ? (
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-green-400 outline-none w-full"
            />
          ) : (
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-green-700 transition-colors"
              onClick={() => setEditingName(true)}
            >
              {list.name}
            </h1>
          )}
          <p className="text-sm text-gray-400 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} · {progress}% done</p>
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-7">
          <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Items */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 && !showAdd ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-4">No items yet. Add some!</p>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Add first item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {categoryLabels[cat]}
              </p>
              <div className="space-y-2">
                {catItems.map((item) => (
                  editingItemId === item.id ? (
                    <AddItemForm
                      key={item.id}
                      initialData={item}
                      onSave={(data) => updateItem(item.id, data)}
                      onCancel={() => setEditingItemId(null)}
                    />
                  ) : (
                    <ListItemRow
                      key={item.id}
                      item={item}
                      onToggle={toggleItem}
                      onDelete={deleteItem}
                      onEdit={(i) => setEditingItemId(i.id)}
                    />
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add item */}
      <div className="mt-6">
        {showAdd ? (
          <AddItemForm onAdd={addItem} onCancel={() => setShowAdd(false)} />
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-3 rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 w-full justify-center transition-all"
          >
            <Plus className="w-4 h-4" />
            Add item
          </button>
        )}
      </div>
    </div>
  );
}