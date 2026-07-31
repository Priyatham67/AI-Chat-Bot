import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIAgent } from '../types/agent';
import { KnowledgeSource } from '../types/knowledge';
import { Conversation, ChatMessage } from '../types/chat';
import { Lead } from '../types/lead';
import {
  INITIAL_AGENTS,
  INITIAL_KNOWLEDGE,
  INITIAL_CONVERSATIONS,
  INITIAL_LEADS,
} from '../data/initialData';

export type NavigationTab =
  | 'dashboard'
  | 'agents'
  | 'builder'
  | 'knowledge'
  | 'conversations'
  | 'leads'
  | 'analytics'
  | 'embed'
  | 'playground';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  agents: AIAgent[];
  knowledgeSources: KnowledgeSource[];
  conversations: Conversation[];
  leads: Lead[];
  currentAgent: AIAgent | undefined;

  // Actions
  createAgent: (agent: Partial<AIAgent>) => AIAgent;
  updateAgent: (id: string, updates: Partial<AIAgent>) => void;
  deleteAgent: (id: string) => void;
  toggleAgentStatus: (id: string) => void;

  addKnowledgeSource: (source: Omit<KnowledgeSource, 'id' | 'updatedAt'>) => Promise<KnowledgeSource>;
  deleteKnowledgeSource: (id: string) => void;

  sendMessageToBot: (agentId: string, conversationId: string, text: string) => Promise<ChatMessage>;
  takeOverConversation: (conversationId: string, repName?: string) => void;
  sendHumanMessage: (conversationId: string, text: string, repName?: string) => void;

  updateLeadStatus: (id: string, status: Lead['status']) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;

  generateInstructionsAI: (params: { name: string; role: string; industry: string; tone: string; goals: string }) => Promise<any>;
  processKnowledgeAI: (params: { title: string; content: string; type: any; sourceUrl?: string }) => Promise<any>;
  getAnalyticsInsightsAI: (agentName: string) => Promise<any>;

  activeWidgetAgent: AIAgent | null;
  setActiveWidgetAgent: (agent: AIAgent | null) => void;
  isWidgetOpen: boolean;
  setIsWidgetOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-apex-sales');

  const [agents, setAgents] = useState<AIAgent[]>(() => {
    const saved = localStorage.getItem('ai_platform_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(() => {
    const saved = localStorage.getItem('ai_platform_knowledge');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('ai_platform_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('ai_platform_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  // Widget preview floating state
  const [activeWidgetAgent, setActiveWidgetAgent] = useState<AIAgent | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ai_platform_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('ai_platform_knowledge', JSON.stringify(knowledgeSources));
  }, [knowledgeSources]);

  useEffect(() => {
    localStorage.setItem('ai_platform_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ai_platform_leads', JSON.stringify(leads));
  }, [leads]);

  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const createAgent = (agentData: Partial<AIAgent>): AIAgent => {
    const newId = `agent-${Date.now()}`;
    const newAgent: AIAgent = {
      id: newId,
      name: agentData.name || 'New AI Assistant',
      avatarUrl: agentData.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      status: 'active',
      role: agentData.role || 'Customer Engagement Specialist',
      industry: agentData.industry || 'General Business',
      tone: agentData.tone || 'friendly',
      language: agentData.language || 'English',
      temperature: agentData.temperature ?? 0.3,
      systemInstructions: agentData.systemInstructions || 'You are an intelligent assistant dedicated to assisting visitors politely and efficiently.',
      fallbackMessage: agentData.fallbackMessage || 'I would be glad to collect your contact email so our specialists can reach out directly.',
      leadCaptureEnabled: agentData.leadCaptureEnabled ?? true,
      leadFields: agentData.leadFields || { name: true, email: true, phone: false, company: true, notes: true },
      humanEscalationEnabled: agentData.humanEscalationEnabled ?? true,
      escalationKeywords: agentData.escalationKeywords || ['human', 'agent', 'representative', 'support'],
      widgetConfig: agentData.widgetConfig || {
        themeColor: '#3b82f6',
        position: 'bottom-right',
        headerTitle: agentData.name || 'AI Concierge',
        headerSubtitle: 'Online 24/7',
        launcherIcon: 'bot',
        welcomeMessage: `👋 Hello! Welcome to our site. How can I help you today?`,
        quickPrompts: ['What products do you offer?', 'How do I contact sales?', 'View pricing options']
      },
      stats: {
        totalConversations: 0,
        leadsCaptured: 0,
        avgResponseTime: '1.0s',
        csat: 5.0,
        resolutionRate: 100
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgentId(newId);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<AIAgent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (selectedAgentId === id) {
      const remaining = agents.filter((a) => a.id !== id);
      if (remaining.length > 0) setSelectedAgentId(remaining[0].id);
    }
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'active' ? 'paused' : 'active';
          return { ...a, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  const addKnowledgeSource = async (source: Omit<KnowledgeSource, 'id' | 'updatedAt'>): Promise<KnowledgeSource> => {
    const newId = `ks-${Date.now()}`;
    const newSource: KnowledgeSource = {
      ...source,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
    setKnowledgeSources((prev) => [newSource, ...prev]);
    return newSource;
  };

  const deleteKnowledgeSource = (id: string) => {
    setKnowledgeSources((prev) => prev.filter((k) => k.id !== id));
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);

    // increment agent lead count
    setAgents((prev) =>
      prev.map((a) => (a.id === lead.agentId ? { ...a, stats: { ...a.stats, leadsCaptured: a.stats.leadsCaptured + 1 } } : a))
    );
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const sendMessageToBot = async (agentId: string, conversationId: string, text: string): Promise<ChatMessage> => {
    const targetAgent = agents.find((a) => a.id === agentId) || currentAgent;
    const agentSources = knowledgeSources.filter((k) => k.agentId === agentId || k.agentId === 'all');

    // Find or create conversation
    let targetConv = conversations.find((c) => c.id === conversationId);
    if (!targetConv) {
      targetConv = {
        id: conversationId,
        agentId: targetAgent.id,
        agentName: targetAgent.name,
        visitorName: 'Website Visitor',
        status: 'active',
        sentiment: 'neutral',
        leadCaptured: false,
        unread: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
    }

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      conversationId: targetConv.id,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...targetConv.messages, userMsg];

    // Optimistically update conversation
    setConversations((prev) => {
      const exists = prev.some((c) => c.id === conversationId);
      if (exists) {
        return prev.map((c) => (c.id === conversationId ? { ...c, messages: updatedHistory, updatedAt: new Date().toISOString() } : c));
      }
      return [{ ...targetConv!, messages: updatedHistory }, ...prev];
    });

    // Call Backend API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: targetAgent,
          userMessage: text,
          conversationHistory: updatedHistory,
          knowledgeSources: agentSources,
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        conversationId: targetConv.id,
        sender: 'agent',
        text: data.responseText || targetAgent.fallbackMessage,
        timestamp: new Date().toISOString(),
        ragSourcesUsed: data.ragSourcesUsed || [],
        isEscalationNotice: data.isEscalationTriggered,
        metadata: {
          sentiment: data.sentiment,
          intentDetected: data.intentDetected,
        },
      };

      // Check if lead captured
      let leadCapturedNow = false;
      if (data.leadCapturedData && (data.leadCapturedData.email || data.leadCapturedData.name)) {
        leadCapturedNow = true;
        addLead({
          agentId: targetAgent.id,
          agentName: targetAgent.name,
          conversationId: targetConv.id,
          name: data.leadCapturedData.name || 'Anonymous Visitor',
          email: data.leadCapturedData.email || 'not-provided@guest.com',
          phone: data.leadCapturedData.phone || '',
          company: data.leadCapturedData.company || '',
          notes: data.leadCapturedData.notes || `Captured during chat: "${text.slice(0, 50)}"`,
          status: 'new',
          intentScore: 90,
        });
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConv!.id) {
            return {
              ...c,
              status: data.isEscalationTriggered ? 'escalated' : c.status,
              sentiment: data.sentiment || c.sentiment,
              leadCaptured: c.leadCaptured || leadCapturedNow,
              messages: [...c.messages, botMsg],
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );

      // Increment stats
      setAgents((prev) =>
        prev.map((a) => (a.id === targetAgent.id ? { ...a, stats: { ...a.stats, totalConversations: a.stats.totalConversations + 1 } } : a))
      );

      return botMsg;
    } catch (err) {
      console.error('Failed to communicate with AI server', err);
      const fallbackBotMsg: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        conversationId: targetConv.id,
        sender: 'agent',
        text: targetAgent.fallbackMessage,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === targetConv!.id ? { ...c, messages: [...c.messages, fallbackBotMsg] } : c))
      );

      return fallbackBotMsg;
    }
  };

  const takeOverConversation = (conversationId: string, repName = 'Support Specialist') => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const sysMsg: ChatMessage = {
            id: `msg-sys-${Date.now()}`,
            conversationId,
            sender: 'human_rep',
            text: `👤 ${repName} joined the chat. AI agent is paused for human assistance.`,
            timestamp: new Date().toISOString(),
          };
          return { ...c, status: 'escalated', messages: [...c.messages, sysMsg] };
        }
        return c;
      })
    );
  };

  const sendHumanMessage = (conversationId: string, text: string, repName = 'Support Specialist') => {
    const msg: ChatMessage = {
      id: `msg-h-${Date.now()}`,
      conversationId,
      sender: 'human_rep',
      text: `${text}`,
      timestamp: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() } : c))
    );
  };

  const generateInstructionsAI = async (params: { name: string; role: string; industry: string; tone: string; goals: string }) => {
    const res = await fetch('/api/agent/generate-instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  };

  const processKnowledgeAI = async (params: { title: string; content: string; type: any; sourceUrl?: string }) => {
    const res = await fetch('/api/knowledge/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  };

  const getAnalyticsInsightsAI = async (agentName: string) => {
    const res = await fetch('/api/analytics/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentName, conversations }),
    });
    return await res.json();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAgentId,
        setSelectedAgentId,
        agents,
        knowledgeSources,
        conversations,
        leads,
        currentAgent,

        createAgent,
        updateAgent,
        deleteAgent,
        toggleAgentStatus,

        addKnowledgeSource,
        deleteKnowledgeSource,

        sendMessageToBot,
        takeOverConversation,
        sendHumanMessage,

        updateLeadStatus,
        addLead,

        generateInstructionsAI,
        processKnowledgeAI,
        getAnalyticsInsightsAI,

        activeWidgetAgent,
        setActiveWidgetAgent,
        isWidgetOpen,
        setIsWidgetOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
