import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIAgent, AgentTone } from '../types/agent';
import {
  Sparkles,
  Bot,
  Sliders,
  FileText,
  FormInput,
  Palette,
  Play,
  Save,
  Trash2,
  Check,
  Plus,
  HelpCircle,
  MessageSquare,
  Globe,
  Loader2,
  RefreshCw,
  Copy
} from 'lucide-react';

export const AgentStudio: React.FC = () => {
  const {
    agents,
    selectedAgentId,
    setSelectedAgentId,
    currentAgent,
    updateAgent,
    deleteAgent,
    createAgent,
    generateInstructionsAI,
    knowledgeSources,
    setActiveWidgetAgent,
    setIsWidgetOpen
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'general' | 'instructions' | 'knowledge' | 'leads' | 'widget'
  >('general');

  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentAgent) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>No agent selected.</p>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAutoGenerateInstructions = async () => {
    setIsGenerating(true);
    try {
      const res = await generateInstructionsAI({
        name: currentAgent.name,
        role: currentAgent.role,
        industry: currentAgent.industry,
        tone: currentAgent.tone,
        goals: 'Provide customer support, capture leads, answer product FAQs',
      });

      if (res.systemInstructions) {
        updateAgent(currentAgent.id, {
          systemInstructions: res.systemInstructions,
          welcomeMessage: res.welcomeMessage || currentAgent.widgetConfig.welcomeMessage,
          fallbackMessage: res.fallbackMessage || currentAgent.fallbackMessage,
          widgetConfig: {
            ...currentAgent.widgetConfig,
            welcomeMessage: res.welcomeMessage || currentAgent.widgetConfig.welcomeMessage,
            quickPrompts: res.quickPrompts || currentAgent.widgetConfig.quickPrompts,
          },
        });
        showToast('✨ AI generated tailored agent instructions and prompts!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating instructions. Check server logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  const linkedKnowledge = knowledgeSources.filter(
    (k) => k.agentId === currentAgent.id || k.agentId === 'all'
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500 text-blue-300 px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentAgent.avatarUrl}
            alt={currentAgent.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentAgent.name}
                onChange={(e) => updateAgent(currentAgent.id, { name: e.target.value })}
                className="bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none px-1 py-0.5"
              />
            </div>
            <p className="text-xs text-slate-400 px-1">{currentAgent.role} • {currentAgent.industry}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer outline-none"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                Switch: {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setActiveWidgetAgent(currentAgent);
              setIsWidgetOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Test Widget</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${currentAgent.name}?`)) {
                deleteAgent(currentAgent.id);
                showToast('Agent deleted');
              }
            }}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
            title="Delete Agent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: '1. Identity & Tone', icon: Sliders },
          { id: 'instructions', label: '2. Behavior & Prompts', icon: FileText },
          { id: 'knowledge', label: '3. Knowledge Base', icon: Globe },
          { id: 'leads', label: '4. Lead Capture & Goals', icon: FormInput },
          { id: 'widget', label: '5. Widget Branding', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB TAB 1: IDENTITY & TONE */}
      {activeSubTab === 'general' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Agent Display Name</label>
              <input
                type="text"
                value={currentAgent.name}
                onChange={(e) => updateAgent(currentAgent.id, { name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Apex Sales Concierge"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Agent Purpose / Role</label>
              <input
                type="text"
                value={currentAgent.role}
                onChange={(e) => updateAgent(currentAgent.id, { role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g. SaaS Solutions Advisor"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Industry Sector</label>
              <input
                type="text"
                value={currentAgent.industry}
                onChange={(e) => updateAgent(currentAgent.id, { industry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g. E-Commerce, Real Estate, Healthcare"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Conversation Tone</label>
              <select
                value={currentAgent.tone}
                onChange={(e) => updateAgent(currentAgent.id, { tone: e.target.value as AgentTone })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="professional">Professional & Articulate</option>
                <option value="friendly">Warm & Friendly</option>
                <option value="concise">Direct & Concise</option>
                <option value="enthusiastic">Enthusiastic & High Energy</option>
                <option value="empathic">Empathic & Supportive</option>
                <option value="formal">Formal & Corporate</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Primary Communication Language</label>
              <select
                value={currentAgent.language}
                onChange={(e) => updateAgent(currentAgent.id, { language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Multilingual">Multilingual Auto-Detect</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
              <input
                type="text"
                value={currentAgent.avatarUrl}
                onChange={(e) => updateAgent(currentAgent.id, { avatarUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Temperature / Creativity Slider */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Model Temperature (Creativity)</span>
                <span className="text-blue-400 font-bold">{currentAgent.temperature}</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {currentAgent.temperature < 0.3
                  ? 'Strictly factual (Best for Docs & Compliance)'
                  : currentAgent.temperature < 0.6
                  ? 'Balanced RAG & Conversational'
                  : 'Creative & Casual'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentAgent.temperature}
              onChange={(e) => updateAgent(currentAgent.id, { temperature: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* SUB TAB 2: BEHAVIOR & PROMPTS */}
      {activeSubTab === 'instructions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">System Instructions Prompt</h3>
              <p className="text-xs text-slate-400">
                Defines the core personality, boundaries, and conversation logic of your AI agent.
              </p>
            </div>

            <button
              onClick={handleAutoGenerateInstructions}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>AI Auto-Generate Prompt</span>
            </button>
          </div>

          <div className="space-y-2">
            <textarea
              rows={8}
              value={currentAgent.systemInstructions}
              onChange={(e) => updateAgent(currentAgent.id, { systemInstructions: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:border-blue-500 focus:outline-none leading-relaxed"
              placeholder="Provide exact instructions for the model..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Fallback Message (Knowledge Gap)</label>
              <textarea
                rows={3}
                value={currentAgent.fallbackMessage}
                onChange={(e) => updateAgent(currentAgent.id, { fallbackMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="What the agent says when answer isn't in knowledge base..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Human Escalation Trigger Keywords</label>
              <input
                type="text"
                value={(currentAgent.escalationKeywords || []).join(', ')}
                onChange={(e) =>
                  updateAgent(currentAgent.id, {
                    escalationKeywords: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="Comma separated e.g. human, speak to rep, complaint"
              />
              <p className="text-[11px] text-slate-500">
                When visitors type these words, the bot will flag for human takeover.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: KNOWLEDGE BASE LINKING */}
      {activeSubTab === 'knowledge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Linked Knowledge Sources</h3>
              <p className="text-xs text-slate-400">
                Documents, FAQs, and Website pages that train this specific agent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedKnowledge.map((src) => (
              <div
                key={src.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {src.type}
                    </span>
                    <h4 className="font-semibold text-xs text-white">{src.title}</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">● Indexed</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 italic">"{src.content}"</p>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Tokens: ~{src.tokenCount}</span>
                  <span>Chunks: {src.chunksCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: LEAD CAPTURE */}
      {activeSubTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Lead Capture Engine</h3>
              <p className="text-xs text-slate-400">
                Automatically identify buying intent and prompt visitors to provide contact info.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentAgent.leadCaptureEnabled}
                onChange={(e) => updateAgent(currentAgent.id, { leadCaptureEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300">Required Lead Fields</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: 'name', label: 'Full Name' },
                { key: 'email', label: 'Email Address' },
                { key: 'phone', label: 'Phone Number' },
                { key: 'company', label: 'Company Name' },
              ].map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(currentAgent.leadFields as any)[field.key]}
                    onChange={(e) =>
                      updateAgent(currentAgent.id, {
                        leadFields: {
                          ...currentAgent.leadFields,
                          [field.key]: e.target.checked,
                        },
                      })
                    }
                    className="rounded accent-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-200">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 5: WIDGET BRANDING & LIVE PREVIEW */}
      {activeSubTab === 'widget' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white">Widget Branding & Colors</h3>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Theme Accent Color</label>
              <div className="flex items-center gap-3">
                {['#3b82f6', '#059669', '#0d9488', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1'].map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      updateAgent(currentAgent.id, {
                        widgetConfig: { ...currentAgent.widgetConfig, themeColor: color },
                      })
                    }
                    className={`w-8 h-8 rounded-full transition ring-offset-2 ring-offset-slate-900 ${
                      currentAgent.widgetConfig.themeColor === color ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Widget Title</label>
              <input
                type="text"
                value={currentAgent.widgetConfig.headerTitle}
                onChange={(e) =>
                  updateAgent(currentAgent.id, {
                    widgetConfig: { ...currentAgent.widgetConfig, headerTitle: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Welcome Message</label>
              <textarea
                rows={3}
                value={currentAgent.widgetConfig.welcomeMessage}
                onChange={(e) =>
                  updateAgent(currentAgent.id, {
                    widgetConfig: { ...currentAgent.widgetConfig, welcomeMessage: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>

          {/* Interactive Live Widget Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <span className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-wider">
              Live Widget Interactive Preview
            </span>

            {/* Widget Mock Frame */}
            <div className="w-full max-w-sm rounded-2xl shadow-2xl border border-slate-800 overflow-hidden bg-slate-900 flex flex-col h-[380px]">
              {/* Header */}
              <div
                className="p-4 text-white flex items-center gap-3"
                style={{ backgroundColor: currentAgent.widgetConfig.themeColor }}
              >
                <img
                  src={currentAgent.avatarUrl}
                  alt={currentAgent.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
                />
                <div>
                  <h4 className="font-bold text-xs">{currentAgent.widgetConfig.headerTitle}</h4>
                  <p className="text-[10px] opacity-80">{currentAgent.widgetConfig.headerSubtitle}</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 bg-slate-950/80 space-y-3 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-200 max-w-[85%] shadow-sm">
                  {currentAgent.widgetConfig.welcomeMessage}
                </div>

                <div className="space-y-1.5 pt-2">
                  {(currentAgent.widgetConfig.quickPrompts || []).map((prompt, idx) => (
                    <button
                      key={idx}
                      className="block w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-blue-400 font-medium transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  disabled
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400"
                />
                <button
                  style={{ backgroundColor: currentAgent.widgetConfig.themeColor }}
                  className="p-2 rounded-xl text-white"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
