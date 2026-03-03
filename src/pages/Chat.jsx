import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Plus, MessageSquare, Trash2, ChevronLeft, Sparkles } from "lucide-react";
import MessageBubble from "@/components/chat/MessageBubble";
import ConversationList from "@/components/chat/ConversationList";
import PullToRefresh from "@/components/layout/PullToRefresh";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    // Handle query param
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setInput(q);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConversation) return;
    const unsub = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsub();
  }, [activeConversation?.id]);

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    const user = await base44.auth.me();
    const [convs, convRecords] = await Promise.all([
      base44.agents.listConversations({ agent_name: "cartly_agent" }),
      base44.entities.Conversation.filter({ is_deleted: false, user_email: user.email }),
    ]);
    const recordMap = {};
    (convRecords || []).forEach((r) => { recordMap[r.agent_conversation_id] = r; });
    const merged = (convs || [])
      .filter((c) => recordMap[c.id])
      .map((c) => ({
        ...c,
        metadata: { ...c.metadata, name: recordMap[c.id]?.name || c.metadata?.name || "New Chat" },
        _record: recordMap[c.id] || null,
      }));
    setConversations(merged);
    setLoadingConversations(false);
  }, []);

  const createNewConversation = async () => {
    const user = await base44.auth.me();
    const conv = await base44.agents.createConversation({
      agent_name: "cartly_agent",
      metadata: { name: "New Chat" },
    });
    const record = await base44.entities.Conversation.create({
      agent_conversation_id: conv.id,
      name: "New Chat",
      user_email: user.email,
      is_deleted: false,
    });
    const enriched = { ...conv, _record: record };
    setConversations((prev) => [enriched, ...prev]);
    setActiveConversation(enriched);
    setMessages([]);
    setSidebarOpen(false);
    return enriched;
  };

  const selectConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    // Preserve the _record so title generation and rename/delete still work
    setActiveConversation({ ...full, _record: conv._record });
    setMessages(full.messages || []);
    setSidebarOpen(false);
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    // Find the DB record and soft-delete it for GDPR compliance
    const conv = conversations.find((c) => c.id === convId);
    if (conv?._record?.id) {
      await base44.entities.Conversation.update(conv._record.id, { is_deleted: true });
    }
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConversation?.id === convId) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  const renameConversation = async (convId, newName) => {
    const conv = conversations.find((c) => c.id === convId);
    if (conv?._record?.id) {
      await base44.entities.Conversation.update(conv._record.id, { name: newName });
    }
    setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, metadata: { ...c.metadata, name: newName } } : c));
    if (activeConversation?.id === convId) {
      setActiveConversation((prev) => ({ ...prev, metadata: { ...prev.metadata, name: newName } }));
    }
  };

  const generateAndSetTitle = async (conv, firstMessage) => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a short, concise chat title (3-5 words max) for a grocery assistant conversation that starts with this message: "${firstMessage}". Return only the title, no quotes or punctuation.`,
    });
    const title = (typeof result === "string" ? result : result?.text || "New Chat").trim();
    if (conv?._record?.id) {
      await base44.entities.Conversation.update(conv._record.id, { name: title });
    }
    setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, metadata: { ...c.metadata, name: title } } : c));
    setActiveConversation((prev) => prev?.id === conv.id ? { ...prev, metadata: { ...prev.metadata, name: title } } : prev);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);

    const isFirstMessage = !activeConversation || messages.length === 0;
    let conv = activeConversation;
    if (!conv) {
      conv = await createNewConversation();
    }

    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    await base44.agents.addMessage(conv, { role: "user", content: text });

    if (isFirstMessage) {
      generateAndSetTitle(conv, text);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F7F9F7]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 w-72 h-full bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          activeId={activeConversation?.id}
          onSelect={selectConversation}
          onDelete={deleteConversation}
          onRename={renameConversation}
          loading={loadingConversations}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Cartly AI</p>
            <p className="text-xs text-gray-400">Your grocery assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {!activeConversation && messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Hey there! 👋</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  I'm Cartly, your smart grocery assistant. Ask me about meals, diets, recipes, or let me build a shopping list for you.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-300 focus-within:bg-white transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about meals, diets, or say 'make me a list'…"
                rows={1}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-32"
                style={{ overflowY: input.split("\n").length > 3 ? "auto" : "hidden" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2.5">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}