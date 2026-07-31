import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code, Copy, Check, ExternalLink, Sparkles, Play, ShieldCheck, Globe } from 'lucide-react';

export const EmbedWidgetStudio: React.FC = () => {
  const { agents, selectedAgentId, setSelectedAgentId, currentAgent, setActiveWidgetAgent, setIsWidgetOpen } = useApp();

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const scriptSnippet = `<!-- OmniBot AI Chatbot Widget -->
<script
  src="${window.location.origin}/widget.js"
  data-agent-id="${currentAgent?.id || 'agent-apex-sales'}"
  data-theme-color="${currentAgent?.widgetConfig?.themeColor || '#3b82f6'}"
  async>
</script>`;

  const reactSnippet = `import React from 'react';
import { ChatbotWidget } from '@omnibot/react';

export default function App() {
  return (
    <div>
      <ChatbotWidget
        agentId="${currentAgent?.id || 'agent-apex-sales'}"
        position="${currentAgent?.widgetConfig?.position || 'bottom-right'}"
      />
    </div>
  );
}`;

  const iframeSnippet = `<iframe
  src="${window.location.origin}/?embed=${currentAgent?.id || 'agent-apex-sales'}"
  style="width: 100%; height: 600px; border: none; border-radius: 16px;"
></iframe>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Embed & Website Integration</h1>
          </div>
          <p className="text-xs text-slate-400">
            Deploy your AI Chatbot to WordPress, Shopify, Webflow, React, HTML sites, or custom web portals with a simple snippet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer outline-none"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                Target Bot: {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (currentAgent) {
                setActiveWidgetAgent(currentAgent);
                setIsWidgetOpen(true);
              }
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Test Live Widget</span>
          </button>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HTML Script Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                HTML / Universal Script
              </span>
              <span className="text-[10px] text-slate-500">Shopify, WordPress, Webflow</span>
            </div>
            <p className="text-xs text-slate-300">
              Paste this single line into the <code className="text-blue-400">&lt;head&gt;</code> or <code className="text-blue-400">&lt;body&gt;</code> of any website.
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto">
              {scriptSnippet}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(scriptSnippet, 'script')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {copiedType === 'script' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy HTML Snippet</span>
              </>
            )}
          </button>
        </div>

        {/* React / Next.js Component Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                React / Next.js Component
              </span>
              <span className="text-[10px] text-slate-500">NPM Package Integration</span>
            </div>
            <p className="text-xs text-slate-300">
              Import as a React component into your web application layout or page structure.
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto">
              {reactSnippet}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(reactSnippet, 'react')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {copiedType === 'react' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy React Code</span>
              </>
            )}
          </button>
        </div>

        {/* iFrame Embed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                iFrame Embed
              </span>
              <span className="text-[10px] text-slate-500">Isolated Portal</span>
            </div>
            <p className="text-xs text-slate-300">
              Embed full-screen inside a dedicated support portal tab or mobile app webview.
            </p>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto">
              {iframeSnippet}
            </pre>
          </div>

          <button
            onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {copiedType === 'iframe' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy iFrame Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
