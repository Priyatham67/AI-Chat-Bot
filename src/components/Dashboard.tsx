import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  MessageSquare,
  Users,
  Star,
  Zap,
  TrendingUp,
  Plus,
  Play,
  Settings,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    agents,
    toggleAgentStatus,
    setSelectedAgentId,
    setActiveTab,
    conversations,
    leads,
    createAgent,
    setIsWidgetOpen,
    setActiveWidgetAgent
  } = useApp();

  const activeAgentsCount = agents.filter((a) => a.status === 'active').length;
  const totalConvos = agents.reduce((acc, a) => acc + (a.stats?.totalConversations || 0), 0);
  const totalLeads = leads.length;
  const avgCsat = (
    agents.reduce((acc, a) => acc + (a.stats?.csat || 4.8), 0) / (agents.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RAG-Powered AI Customer Workforce</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI Customer Engagement Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Deploy intelligent AI agents trained on your custom documents, website pages, and FAQs. Automate 24/7 customer support, capture qualified leads, and schedule appointments effortlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const newA = createAgent({ name: 'Support & Sales Bot' });
                setSelectedAgentId(newA.id);
                setActiveTab('builder');
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create AI Agent</span>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Manage Knowledge Base</span>
            </button>
          </div>
        </div>
      </div>

      {/* High Level Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active AI Agents</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeAgentsCount}</span>
            <span className="text-xs text-slate-400">/ {agents.length} total</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready for 24/7 deployment</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Conversations</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalConvos.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium">+18% this week</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Avg response time: ~1.2s</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Captured Leads</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalLeads}</span>
            <span className="text-xs text-indigo-400 font-medium">Qualified</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            <span>High intent visitors</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg CSAT Score</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{avgCsat}</span>
            <span className="text-xs text-amber-400 font-medium">/ 5.0 rating</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Based on customer feedback</span>
          </div>
        </div>
      </div>

      {/* AI Agents Fleet Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">AI Agent Workforce</h2>
            <p className="text-xs text-slate-400">Manage, train, customize, and monitor your AI chatbots</p>
          </div>
          <button
            onClick={() => setActiveTab('agents')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <span>View All Agents ({agents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {agents.map((agent) => {
            const isActive = agent.status === 'active';
            return (
              <div
                key={agent.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Header & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white line-clamp-1">{agent.name}</h3>
                        <p className="text-xs text-slate-400">{agent.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isActive ? '● Active' : '○ Paused'}
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {agent.industry}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                      {agent.tone} Tone
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
                      Temp: {agent.temperature}
                    </span>
                  </div>

                  {/* System Instruction snippet */}
                  <p className="text-xs text-slate-400 line-clamp-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 italic">
                    "{agent.systemInstructions}"
                  </p>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{agent.stats.totalConversations}</div>
                      <div className="text-[10px] text-slate-500">Chats</div>
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-400">{agent.stats.leadsCaptured}</div>
                      <div className="text-[10px] text-slate-500">Leads</div>
                    </div>
                    <div>
                      <div className="font-semibold text-amber-400">★ {agent.stats.csat}</div>
                      <div className="text-[10px] text-slate-500">CSAT</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setActiveTab('builder');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveWidgetAgent(agent);
                      setIsWidgetOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-blue-400" />
                    <span>Test Widget</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Recent Leads & Live Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Qualified Leads */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">Recent Qualified Leads</h3>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All ({leads.length})
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200">{lead.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Score: {lead.intentScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{lead.email} {lead.company ? `• ${lead.company}` : ''}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">"{lead.notes}"</p>
                </div>

                <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 font-medium capitalize whitespace-nowrap">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Conversations Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Recent Conversations</h3>
            </div>
            <button
              onClick={() => setActiveTab('conversations')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Open Inbox
            </button>
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 4).map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveTab('conversations')}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{conv.visitorName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                        conv.status === 'escalated'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {conv.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{lastMsg?.text || 'No messages yet'}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Bot: {conv.agentName}</span>
                    <span>{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
