import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead } from '../types/lead';
import {
  Users,
  Search,
  Download,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const LeadsDirectory: React.FC = () => {
  const { leads, updateLeadStatus, agents, conversations, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAgent = selectedAgentFilter === 'all' || lead.agentId === selectedAgentFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesAgent && matchesStatus;
  });

  const exportLeadsCSV = () => {
    const headers = ['ID,Name,Email,Phone,Company,AgentName,IntentScore,Status,CreatedAt,Notes'];
    const rows = filteredLeads.map((l) =>
      [
        l.id,
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone || ''}"`,
        `"${l.company || ''}"`,
        `"${l.agentName}"`,
        l.intentScore,
        l.status,
        l.createdAt,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_chatbot_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Captured Customer Leads</h1>
          </div>
          <p className="text-xs text-slate-400">
            Prospects qualified and collected automatically by your AI Chatbot workforce during 24/7 conversations.
          </p>
        </div>

        <button
          onClick={exportLeadsCSV}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lead name, email, company..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedAgentFilter}
          onChange={(e) => setSelectedAgentFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none cursor-pointer"
        >
          <option value="all">All AI Agents ({agents.length})</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Lead Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Capturing AI Agent</th>
                <th className="p-4">Intent Score</th>
                <th className="p-4">Lead Status</th>
                <th className="p-4">Captured Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div>{lead.name}</div>
                      {lead.company && <div className="text-[10px] text-slate-400 font-normal">{lead.company}</div>}
                    </div>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium">
                      {lead.agentName}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {lead.intentScore}%
                    </span>
                  </td>

                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white cursor-pointer outline-none capitalize"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>

                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveLeadModal(lead)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {activeLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-sm text-white">Lead Submission Record</h3>
              <button
                onClick={() => setActiveLeadModal(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{activeLeadModal.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Intent: {activeLeadModal.intentScore}%
                  </span>
                </div>

                <div className="space-y-1 text-slate-300">
                  <div>Email: {activeLeadModal.email}</div>
                  {activeLeadModal.phone && <div>Phone: {activeLeadModal.phone}</div>}
                  {activeLeadModal.company && <div>Company: {activeLeadModal.company}</div>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Captured Notes / Inquiry Snippet:</label>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 italic text-slate-200 leading-relaxed">
                  "{activeLeadModal.notes}"
                </p>
              </div>

              <div className="text-[11px] text-slate-500">
                Captured by AI Agent: <strong>{activeLeadModal.agentName}</strong> on{' '}
                {new Date(activeLeadModal.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveLeadModal(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
