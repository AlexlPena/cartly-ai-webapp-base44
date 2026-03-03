import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search } from "lucide-react";
import ListCard from "@/components/lists/ListCard";
import CreateListModal from "@/components/lists/CreateListModal";
import PullToRefresh from "@/components/layout/PullToRefresh";
import ListDetailView from "@/components/lists/ListDetailView";
import { AnimatePresence, motion } from "framer-motion";

function getListIdFromHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#list=")) return hash.slice(6);
  return null;
}

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedListId, setSelectedListId] = useState(getListIdFromHash);

  // Sync hash → state (back/forward button support)
  useEffect(() => {
    const onPopState = () => setSelectedListId(getListIdFromHash());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = useCallback(async () => {
    setLoading(true);
    const user = await base44.auth.me();
    const data = await base44.entities.List.filter(
      { is_archived: false, created_by: user.email },
      "-created_date"
    );
    setLists(data || []);
    setLoading(false);
  }, []);

  const openList = (listId) => {
    window.history.pushState(null, "", `${window.location.pathname}#list=${listId}`);
    setSelectedListId(listId);
  };

  const closeList = () => {
    window.history.pushState(null, "", window.location.pathname);
    setSelectedListId(null);
    loadLists();
  };

  const handleCreateList = async (name, color) => {
    const list = await base44.entities.List.create({
      name,
      color,
      is_archived: false,
      total_items: 0,
      completed_items: 0,
    });
    setLists((prev) => [list, ...prev]);
    setShowCreate(false);
    openList(list.id);
  };

  const handleDeleteList = async (listId) => {
    await base44.entities.List.delete(listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
    if (selectedListId === listId) closeList();
  };

  const filtered = lists.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden">
      {/* Lists grid */}
      <AnimatePresence initial={false}>
        {!selectedListId && (
          <motion.div
            key="list-grid"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <PullToRefresh onRefresh={loadLists} className="h-[calc(100vh-64px)] md:h-auto">
              <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Lists</h1>
                    <p className="text-sm text-gray-400 mt-1">
                      {lists.length} active list{lists.length !== 1 ? "s" : ""}
                    </p>
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
                      <div
                        key={i}
                        className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse"
                      />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="text-5xl mb-4">🛒</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {search ? "No lists found" : "No lists yet"}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      {search
                        ? "Try a different search"
                        : "Create your first grocery list or ask Cartly to make one."}
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
                        onClick={() => openList(list.id)}
                        onDelete={() => handleDeleteList(list.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </PullToRefresh>
          </motion.div>
        )}

        {selectedListId && (
          <motion.div
            key={`detail-${selectedListId}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-0 top-16 bg-[#F7F9F7] z-10 overflow-y-auto pb-20 md:pb-0"
          >
            <ListDetailView
              listId={selectedListId}
              onBack={closeList}
              onDelete={() => handleDeleteList(selectedListId)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showCreate && (
        <CreateListModal onClose={() => setShowCreate(false)} onCreate={handleCreateList} />
      )}
    </div>
  );
}