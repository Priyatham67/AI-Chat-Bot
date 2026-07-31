import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types/chat';
import { AIAgent } from '../types/agent';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ChatbotWidget: React.FC = () => {
  const {
    isWidgetOpen,
    setIsWidgetOpen,
    activeWidgetAgent,
    currentAgent,
    sendMessageToBot,
    addLead
  } = useApp();

  const agent: AIAgent = activeWidgetAgent || currentAgent;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Lead modal state inside widget
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    if (agent) {
      setMessages([
        {
          id: `welcome-${agent.id}`,
          conversationId: `widget-conv-${agent.id}`,
          sender: 'agent',
          text: agent.widgetConfig?.welcomeMessage || `👋 Hi! I am ${agent.name}. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [agent?.id]);

  if (!agent) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    setInputMessage('');
    setIsSending(true);

    const convId = `widget-conv-${agent.id}`;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      conversationId: convId,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await sendMessageToBot(agent.id, convId, text);
      setMessages((prev) => [...prev, response]);

      // Trigger lead prompt if intent is demo or pricing or lead prompt
      if (
        agent.leadCaptureEnabled &&
        !leadSubmitted &&
        (text.toLowerCase().includes('demo') ||
          text.toLowerCase().includes('pricing') ||
          text.toLowerCase().includes('contact') ||
          response.isLeadPrompt)
      ) {
        setTimeout(() => setShowLeadForm(true), 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitLeadForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;

    addLead({
      agentId: agent.id,
      agentName: agent.name,
      conversationId: `widget-conv-${agent.id}`,
      name: leadName || 'Website Visitor',
      email: leadEmail,
      phone: leadPhone,
      company: leadCompany,
      notes: `Captured via Chatbot Widget on ${agent.name}`,
      status: 'new',
      intentScore: 92,
    });

    setLeadSubmitted(true);
    setShowLeadForm(false);

    const thankMsg: ChatMessage = {
      id: `lead-thanks-${Date.now()}`,
      conversationId: `widget-conv-${agent.id}`,
      sender: 'agent',
      text: `Thank you ${leadName || 'there'}! I've saved your details. Our team will reach out to ${leadEmail} shortly.`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, thankMsg]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isWidgetOpen && (
        <button
          onClick={() => setIsWidgetOpen(true)}
          style={{ backgroundColor: agent.widgetConfig?.themeColor || '#3b82f6' }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white shadow-2xl hover:scale-105 transition duration-200 flex items-center gap-2"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold text-xs hidden sm:inline">{agent.widgetConfig?.headerTitle || 'Chat with us'}</span>
        </button>
      )}

      {/* Expanded Widget Card */}
      {isWidgetOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] h-[540px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Widget Header */}
          <div
            style={{ backgroundColor: agent.widgetConfig?.themeColor || '#3b82f6' }}
            className="p-4 text-white flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30"
              />
              <div>
                <h3 className="font-bold text-xs">{agent.widgetConfig?.headerTitle || agent.name}</h3>
                <p className="text-[10px] opacity-80">{agent.widgetConfig?.headerSubtitle || 'Online 24/7'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsWidgetOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Widget Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {msg.ragSourcesUsed && msg.ragSourcesUsed.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-0.5">
                        <span className="font-semibold text-blue-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Source: {msg.ragSourcesUsed[0].sourceTitle}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Starter Prompts */}
            {messages.length <= 2 && agent.widgetConfig?.quickPrompts?.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Suggested Questions:</span>
                {agent.widgetConfig.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="block w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-blue-400 font-medium transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Lead Capture Popup inside Chat */}
            {showLeadForm && (
              <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Connect with a Specialist</span>
                </div>
                <form onSubmit={handleSubmitLeadForm} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address *"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: agent.widgetConfig?.themeColor || '#3b82f6' }}
                    className="w-full py-2 rounded-lg text-white font-bold text-xs shadow transition"
                  >
                    Submit Info
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Widget Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              disabled={isSending}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              style={{ backgroundColor: agent.widgetConfig?.themeColor || '#3b82f6' }}
              className="p-2 rounded-xl text-white transition disabled:opacity-40"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
