import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types/chat';
import {
  Terminal,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Info,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';

export const PlaygroundSandbox: React.FC = () => {
  const { currentAgent, agents, selectedAgentId, setSelectedAgentId, sendMessageToBot, knowledgeSources } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-demo',
      conversationId: 'sandbox-1',
      sender: 'agent',
      text: currentAgent?.widgetConfig?.welcomeMessage || '👋 Welcome to the AI Playground Sandbox!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [lastDebugTrace, setLastDebugTrace] = useState<any>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage;
    setInputMessage('');
    setIsSending(true);

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      conversationId: 'sandbox-1',
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await sendMessageToBot(currentAgent.id, 'sandbox-1', userText);
      setMessages((prev) => [...prev, response]);
      setLastDebugTrace({
        agentName: currentAgent.name,
        temperature: currentAgent.temperature,
        systemInstructionLength: currentAgent.systemInstructions.length,
        sourcesRetrieved: response.ragSourcesUsed || [],
        sentiment: response.metadata?.sentiment || 'neutral',
        intent: response.metadata?.intentDetected || 'general_qna',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const clearSandbox = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        conversationId: 'sandbox-1',
        sender: 'agent',
        text: currentAgent?.widgetConfig?.welcomeMessage || '👋 Welcome to the AI Playground Sandbox!',
        timestamp: new Date().toISOString(),
      },
    ]);
    setLastDebugTrace(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">AI Agent Interactive Sandbox</h1>
          </div>
          <p className="text-xs text-slate-400">
            Test model prompts, RAG document retrieval, fallback triggers, and lead capture rules in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAgentId}
            onChange={(e) => {
              setSelectedAgentId(e.target.value);
              clearSandbox();
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer outline-none font-semibold"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                Testing Agent: {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={clearSandbox}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
        {/* Chat Tester Stream */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                    {isUser ? (
                      <>
                        <span>User Visitor</span>
                        <User className="w-3 h-3 text-slate-400" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400 font-semibold">{currentAgent.name} (AI)</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.ragSourcesUsed && msg.ragSourcesUsed.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
                        <span className="font-semibold text-blue-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Retrieved RAG Sources:</span>
                        </span>
                        {msg.ragSourcesUsed.map((src, i) => (
                          <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                            <strong>{src.sourceTitle}</strong>: "{src.snippet}"
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
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${currentAgent.name} anything...`}
              disabled={isSending}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Debug Trace Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 overflow-y-auto shadow-lg text-xs">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>RAG & Gemini Debug Inspector</span>
          </h3>

          {lastDebugTrace ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Model:</span>
                  <span className="font-mono text-blue-400 font-bold">gemini-3.6-flash</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Temperature:</span>
                  <span className="font-mono text-amber-400 font-bold">{lastDebugTrace.temperature}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Sentiment Detected:</span>
                  <span className="font-mono text-emerald-400 font-bold capitalize">{lastDebugTrace.sentiment}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Intent Category:</span>
                  <span className="font-mono text-indigo-400 font-bold">{lastDebugTrace.intent}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Retrieved Vector Sources ({lastDebugTrace.sourcesRetrieved.length})</span>
                {lastDebugTrace.sourcesRetrieved.map((s: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                    <div className="font-bold text-blue-400">{s.sourceTitle}</div>
                    <div className="text-slate-400 italic">"{s.snippet}"</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <p>Send a test message to inspect the live RAG vector retrieval, sentiment analysis, and Gemini parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
