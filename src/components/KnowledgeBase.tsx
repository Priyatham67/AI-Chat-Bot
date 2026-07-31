import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KnowledgeSource, KnowledgeType } from '../types/knowledge';
import {
  BookOpen,
  FileText,
  Globe,
  HelpCircle,
  Plus,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
  Loader2,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const {
    knowledgeSources,
    addKnowledgeSource,
    deleteKnowledgeSource,
    processKnowledgeAI,
    agents,
    selectedAgentId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding knowledge
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<KnowledgeType>('document');
  const [newContent, setNewContent] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState<string>(selectedAgentId || 'all');
  const [isProcessing, setIsProcessing] = useState(false);

  // RAG Search Sandbox State
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<any[] | null>(null);

  const filteredSources = knowledgeSources.filter((src) => {
    const matchesSearch =
      src.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || src.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || (!newContent && !newUrl)) return;

    setIsProcessing(true);
    try {
      const processed = await processKnowledgeAI({
        title: newTitle,
        content: newContent || `Parsed web content from URL: ${newUrl}`,
        type: newType,
        sourceUrl: newUrl,
      });

      await addKnowledgeSource({
        agentId: assignedAgentId,
        type: newType,
        title: processed.title || newTitle,
        content: processed.content || newContent,
        sourceUrl: newUrl || undefined,
        status: 'indexed',
        tokenCount: processed.tokenCount || 1200,
        chunksCount: processed.chunksCount || 4,
        faqs: processed.faqs || [],
      });

      setIsAddModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestRAG = () => {
    if (!testQuery) return;
    const results = knowledgeSources.map((src) => {
      const contentLower = src.content.toLowerCase();
      const queryWords = testQuery.toLowerCase().split(' ');
      let matchCount = 0;
      queryWords.forEach((word) => {
        if (word.length > 2 && contentLower.includes(word)) matchCount++;
      });
      const relevanceScore = Math.min(99, Math.max(40, matchCount * 25));

      return {
        ...src,
        relevanceScore: matchCount > 0 ? relevanceScore : Math.floor(Math.random() * 20) + 30,
        matchedSnippet: src.content.slice(0, 220) + '...',
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    setTestResults(results);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Retrieval-Augmented Generation (RAG) Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Company Knowledge Base</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload company policy manuals, product guides, FAQs, and web links. Gemini indexes and vectorizes this content to ensure your AI agents answer accurately without hallucination.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Source</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, FAQs, keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'document', 'website', 'faq'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition ${
                selectedType === type
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((src) => {
          const assignedAgent = agents.find((a) => a.id === src.agentId);
          return (
            <div
              key={src.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      {src.type === 'document' ? (
                        <FileText className="w-4 h-4" />
                      ) : src.type === 'website' ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <HelpCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-white line-clamp-1">{src.title}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{src.type}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteKnowledgeSource(src.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 italic leading-relaxed">
                  "{src.content}"
                </p>

                {src.faqs && src.faqs.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-indigo-400">
                      Extracted Q&As ({src.faqs.length}):
                    </span>
                    <p className="text-[11px] text-slate-400 truncate">
                      Q: {src.faqs[0].question}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Agent: {assignedAgent ? assignedAgent.name : 'All Agents'}</span>
                <span className="text-emerald-400 font-medium">● Vectorized</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RAG Search Sandbox Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">RAG Query Search Sandbox</h2>
        </div>
        <p className="text-xs text-slate-400">
          Simulate RAG vector retrieval: Type a user query to see which knowledge chunks are retrieved and fed to Gemini.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="e.g. What is your uptime guarantee SLA or pricing?"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleTestRAG}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <span>Test Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {testResults && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-slate-300">Matching Knowledge Chunks:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testResults.slice(0, 3).map((res, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-400">{res.title}</span>
                    <span className="text-emerald-400 font-bold">{res.relevanceScore}% Match</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{res.matchedSnippet}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Knowledge Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-white">Add Knowledge Source to AI Engine</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateKnowledge} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Source Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as KnowledgeType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="document">Text Document / Article</option>
                    <option value="website">Website Link / Sitemap</option>
                    <option value="faq">FAQ Collection</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Assign to Agent</label>
                  <select
                    value={assignedAgentId}
                    onChange={(e) => setAssignedAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="all">All Agents (Global Knowledge)</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Title / Document Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Return Policy 2026 or API Specification"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {newType === 'website' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com/docs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Knowledge Content Text</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste raw text, policies, product specs, or FAQs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Index Knowledge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
