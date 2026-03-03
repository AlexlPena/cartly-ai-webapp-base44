import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, Plus, Trash2, ShoppingBag } from "lucide-react";
import ListItemRow from "@/components/lists/ListItemRow";
import AddItemForm from "@/components/lists/AddItemForm";

const categoryOrder = ["produce", "meat_seafood", "dairy_eggs", "bakery", "pantry", "frozen", "beverages", "snacks", "household", "personal_care", "other"];
const categoryLabels = {
  produce: "🥦 Produce", meat_seafood: "🥩 Meat & Seafood", dairy_eggs: "🥛 Dairy & Eggs",
  bakery: "🍞 Bakery", pantry: "🫙 Pantry", frozen: "🧊 Frozen", beverages: "🧃 Beverages",
  snacks: "🍿 Snacks", household: "🧹 Household", personal_care: "🧴 Personal Care", other: "📦 Other",
};

export default function ListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    loadAll();
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    const [listData, itemsData] = await Promise.all([
      base44.entities.List.filter({ id }),
      base44.entities.ListItem.filter({ list_id: id }, "category"),
    ]);
    const l = Array.isArray(listData) ? listData[0] : listData;
    setList(l || null);
    setNameVal(l?.name || "");
    setItems(itemsData || []);
    setLoading(false);
    if (l) syncCounts(l, itemsData || []);
  };

  const syncCounts = async (l, itemList) => {
    const total = itemList.length;
    const completed = itemList.filter((i) => i.is_checked).length;
    if (l.total_items !== total || l.completed_items !== completed) {
      const updated = await base44.entities.List.update(l.id, { total_items: total, completed_items: completed });
      setList(updated);
    }
  };

  const addItem = async (data) => {
    const item = await base44.entities.ListItem.create({ ...data, list_id: id, is_checked: false });
    const updated = [...items, item];
    setItems(updated);
    syncCounts(list, updated);
    setShowAdd(false);
  };

  const toggleItem = async (item) => {
    const updated_item = await base44.entities.ListItem.update(item.id, { is_checked: !item.is_checked });
    const updated = items.map((i) => i.id === item.id ? updated_item : i);
    setItems(updated);
    syncCounts(list, updated);
  };

  const deleteItem = async (itemId) => {
    await base44.entities.ListItem.delete(itemId);
    const updated = items.filter((i) => i.id !== itemId);
    setItems(updated);
    syncCounts(list, updated);
  };

  const updateItem = async (itemId, data) => {
    const updated_item = await base44.entities.ListItem.update(itemId, data);
    const updated = items.map((i) => i.id === itemId ? updated_item : i);
    setItems(updated);
    setEditingItemId(null);
  };

  const saveName = async () => {
    if (!nameVal.trim() || nameVal === list?.name) { setEditingName(false); return; }
    const updated = await base44.entities.List.update(id, { name: nameVal.trim() });
    setList(updated);
    setEditingName(false);
  };

  const handleDelete = async () => {
    await base44.entities.List.delete(id);
    navigate(-1);
  };

  const grouped = categoryOrder.reduce((acc, cat) => {
    const catItems = items.filter((i) => (i.category || "other") === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  const progress = items.length > 0 ? Math.round((items.filter((i) => i.is_checked).length / items.length) * 100) : 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-24 text-gray-400 text-sm">List not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-green-600 font-medium text-sm hover:text-green-700 transition-all select-none -ml-1 pr-2 py-1"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Lists</span>
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
          onClick={handleDelete}
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
      {items.length === 0 && !showAdd ? (
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