import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Loader2,
  RefreshCw,
  Users
} from 'lucide-react';

const CONVERSATION_TREND_DATA = [
  { day: 'Mon', conversations: 120, leads: 28 },
  { day: 'Tue', conversations: 180, leads: 42 },
  { day: 'Wed', conversations: 240, leads: 61 },
  { day: 'Thu', conversations: 310, leads: 78 },
  { day: 'Fri', conversations: 290, leads: 69 },
  { day: 'Sat', conversations: 190, leads: 38 },
  { day: 'Sun', conversations: 220, leads: 52 },
];

const SENTIMENT_PIE_DATA = [
  { name: 'Positive', value: 68, color: '#10b981' },
  { name: 'Neutral', value: 24, color: '#3b82f6' },
  { name: 'Negative', value: 8, color: '#f43f5e' },
];

export const AnalyticsStudio: React.FC = () => {
  const { agents, conversations, getAnalyticsInsightsAI, currentAgent } = useApp();

  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const data = await getAnalyticsInsightsAI(currentAgent?.name || 'AI Assistants');
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [currentAgent?.id]);

  const agentChartData = agents.map((a) => ({
    name: a.name.split(' ')[0],
    conversations: a.stats?.totalConversations || 100,
    leads: a.stats?.leadsCaptured || 25,
    csat: a.stats?.csat || 4.8,
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Analytics & AI Insights</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monitor customer interaction trends, lead conversion efficiency, and Gemini-driven knowledge gap audits.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loadingInsights}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition disabled:opacity-50"
        >
          {loadingInsights ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-blue-400" />}
          <span>Refresh AI Insights</span>
        </button>
      </div>

      {/* GEMINI AI AUDIT & INSIGHTS CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Gemini AI Performance & Knowledge Gap Audit</h2>
              <p className="text-xs text-slate-300">Automated evaluation of customer chat transcripts for {currentAgent?.name}</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
            Live AI Analysis
          </span>
        </div>

        {loadingInsights ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
            <p className="text-xs">Analyzing customer transcripts with Gemini...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Friction Points */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Customer Friction Points</span>
              </h3>
              <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                {(aiInsights?.topFrictionPoints || [
                  'High volume of inquiries asking for custom SLA terms',
                  'Users asking about native CRM integration capabilities',
                ]).map((pt: string, i: number) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Knowledge Gaps */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Knowledge Base Gaps</span>
              </h3>
              <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                {(aiInsights?.knowledgeGaps || [
                  'Missing international multi-currency pricing documentation',
                  'Need updated Webhooks and API rate limits FAQ',
                ]).map((pt: string, i: number) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Actionable Recommendations</span>
              </h3>
              <ul className="space-y-1.5 text-slate-300 list-disc pl-4 leading-relaxed">
                {(aiInsights?.recommendations || [
                  'Add dedicated FAQ for API integration setup',
                  'Enable automatic lead form trigger after 2 pricing questions',
                ]).map((pt: string, i: number) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Conversation Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-white">7-Day Conversation & Lead Trajectory</h3>
            <span className="text-[10px] text-emerald-400 font-medium">+24% growth</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONVERSATION_TREND_DATA}>
                <defs>
                  <linearGradient id="colorConvo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="conversations" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConvo)" />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Agent Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-xs text-white">Lead Conversion by AI Agent</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="conversations" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Conversations" />
                <Bar dataKey="leads" fill="#10b981" radius={[6, 6, 0, 0]} name="Qualified Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
