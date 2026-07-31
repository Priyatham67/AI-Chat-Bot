import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Bot,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  MessageSquare,
  Users,
  BarChart3,
  Code,
  Terminal,
  Plus,
  Play
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    agents,
    selectedAgentId,
    setSelectedAgentId,
    createAgent,
    setIsWidgetOpen,
    setActiveWidgetAgent,
    currentAgent
  } = useApp();

  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'builder', label: 'Agent Studio', icon: Sparkles },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'embed', label: 'Embed & Integrate', icon: Code },
    { id: 'playground', label: 'Playground', icon: Terminal },
  ];

  const handleQuickPreviewWidget = () => {
    if (currentAgent) {
      setActiveWidgetAgent(currentAgent);
      setIsWidgetOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">OmniBot AI</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  RAG Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Enterprise AI Agent & Knowledge Engine</p>
            </div>
          </div>

          {/* Quick Agent Selector & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-slate-400">Active Agent:</span>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-slate-900 text-slate-200">
                    {agent.name} ({agent.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const newA = createAgent({ name: 'New AI Assistant' });
                setSelectedAgentId(newA.id);
                setActiveTab('builder');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Agent</span>
            </button>

            <button
              onClick={handleQuickPreviewWidget}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              title="Test floating widget on page"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Test Widget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
