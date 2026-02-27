import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search } from "lucide-react";
import ListCard from "@/components/lists/ListCard";
import ListDetail from "@/components/lists/ListDetail";
import CreateListModal from "@/components/lists/CreateListModal";

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    const data = await base44.entities.List.filter({ is_archived: false }, "-created_date");
    setLists(data || []);
    setLoading(false);
  };

  const handleCreateList = async (name, color) => {
    const list = await base44.entities.List.create({ name, color, is_archived: false, total_items: 0, completed_items: 0 });
    setLists((prev) => [list, ...prev]);
    setShowCreate(false);
    setSelectedList(list);
  };

  const handleDeleteList = async (listId) => {
    await base44.entities.List.delete(listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
    if (selectedList?.id === listId) setSelectedList(null);
  };

  const filtered = lists.filter((l) => l.name?.toLowerCase().includes(search.toLowerCase()));

  if (selectedList) {
    return (
      <ListDetail
        list={selectedList}
        onBack={() => { setSelectedList(null); loadLists(); }}
        onDelete={() => handleDeleteList(selectedList.id)}
        onUpdate={(updated) => {
          setSelectedList(updated);
          setLists((prev) => prev.map((l) => l.id === updated.id ? updated : l));
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Lists</h1>
          <p className="text-sm text-gray-400 mt-1">{lists.length} active list{lists.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New List
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lists…"
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-50 transition-all"
        />
      </div>

      {/* Lists grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search ? "No lists found" : "No lists yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            {search ? "Try a different search" : "Create your first grocery list or ask Cartly to make one."}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
            >
              Create a list
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => setSelectedList(list)}
              onDelete={() => handleDeleteList(list.id)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateListModal onClose={() => setShowCreate(false)} onCreate={handleCreateList} />
      )}
    </div>
  );
}