import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Conversation, ChatMessage } from '../types/chat';
import {
  MessageSquare,
  Search,
  UserCheck,
  ShieldAlert,
  Send,
  User,
  Bot,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export const LiveConversations: React.FC = () => {
  const {
    conversations,
    takeOverConversation,
    sendHumanMessage,
    agents
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [humanInputText, setHumanInputText] = useState('');

  const selectedConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConvs = conversations.filter((c) => {
    const matchesSearch =
      c.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.visitorEmail && c.visitorEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'escalated' && c.status === 'escalated') ||
      (filterStatus === 'leads' && c.leadCaptured);
    return matchesSearch && matchesStatus;
  });

  const handleSendHumanMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanInputText.trim() || !selectedConv) return;
    sendHumanMessage(selectedConv.id, humanInputText, 'Support Specialist');
    setHumanInputText('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 pb-6">
      {/* LEFT PANEL: CONVERSATION LIST */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
        {/* Header & Filter */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Live Inbox</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visitor or email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All Chats' },
              { id: 'escalated', label: 'Escalated 🔔' },
              { id: 'leads', label: 'Leads 🎯' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                  filterStatus === tab.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredConvs.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 cursor-pointer transition space-y-1.5 ${
                  isSelected ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white line-clamp-1">{conv.visitorName}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1 italic">
                  "{lastMsg?.text || 'No messages'}"
                </p>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{conv.agentName}</span>
                  {conv.status === 'escalated' ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                      Human Transfer
                    </span>
                  ) : conv.leadCaptured ? (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                      Lead Captured
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">● AI Active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT TRANSCRIPT & VISITOR SIDEBAR */}
      {selectedConv ? (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col lg:flex-row overflow-hidden shadow-lg">
          {/* Main Chat Stream */}
          <div className="flex-1 flex flex-col h-full border-r border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                  {selectedConv.visitorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>{selectedConv.visitorName}</span>
                    {selectedConv.visitorEmail && (
                      <span className="text-xs font-normal text-slate-400">({selectedConv.visitorEmail})</span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Handled by <strong className="text-blue-400">{selectedConv.agentName}</strong> • {selectedConv.visitorLocation || 'Online'}
                  </p>
                </div>
              </div>

              {selectedConv.status !== 'escalated' ? (
                <button
                  onClick={() => takeOverConversation(selectedConv.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Take Over as Human</span>
                </button>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Human Interventions Active</span>
                </span>
              )}
            </div>

            {/* Chat Transcript Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60">
              {selectedConv.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isHumanRep = msg.sender === 'human_rep';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                      {isUser ? (
                        <>
                          <span>{selectedConv.visitorName}</span>
                          <User className="w-3 h-3 text-slate-400" />
                        </>
                      ) : isHumanRep ? (
                        <>
                          <UserCheck className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 font-semibold">Human Support Rep</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 font-medium">{selectedConv.agentName} (AI)</span>
                        </>
                      )}
                      <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : isHumanRep
                          ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}

                      {/* RAG sources indicator */}
                      {msg.ragSourcesUsed && msg.ragSourcesUsed.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                          <span className="font-semibold text-blue-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>RAG Knowledge Source Used:</span>
                          </span>
                          {msg.ragSourcesUsed.map((src, i) => (
                            <div key={i} className="bg-slate-950 p-1.5 rounded border border-slate-800 italic">
                              "{src.sourceTitle}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendHumanMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={humanInputText}
                onChange={(e) => setHumanInputText(e.target.value)}
                placeholder={
                  selectedConv.status === 'escalated'
                    ? 'Type your message as Human Support Agent...'
                    : 'Click "Take Over" above to chat manually...'
                }
                disabled={selectedConv.status !== 'escalated'}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={selectedConv.status !== 'escalated' || !humanInputText.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Visitor Sidebar Details */}
          <div className="w-full lg:w-72 bg-slate-950 p-4 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-5 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Visitor Profile & Lead Details</span>
            </h4>

            <div className="space-y-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Lead Status</span>
                <div>
                  {selectedConv.leadCaptured ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      ✓ Qualified Lead Captured
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No contact details submitted yet</span>
                  )}
                </div>
              </div>

              {selectedConv.leadDetails && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  {Object.entries(selectedConv.leadDetails).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 capitalize">{k}: </span>
                      <span className="text-slate-200 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Technical Metadata</span>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div>Browser: {selectedConv.visitorBrowser || 'Chrome / macOS'}</div>
                <div>Location: {selectedConv.visitorLocation || 'San Francisco, US'}</div>
                <div>Started: {new Date(selectedConv.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-8 text-slate-400 text-xs">
          Select a conversation from the left to view the transcript.
        </div>
      )}
    </div>
  );
};
