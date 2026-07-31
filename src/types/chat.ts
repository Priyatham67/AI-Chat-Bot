export interface RAGSourceRef {
  sourceId: string;
  sourceTitle: string;
  snippet: string;
  relevanceScore?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'agent' | 'human_rep';
  text: string;
  timestamp: string;
  ragSourcesUsed?: RAGSourceRef[];
  isLeadPrompt?: boolean;
  isEscalationNotice?: boolean;
  metadata?: {
    sentiment?: 'positive' | 'neutral' | 'negative';
    intentDetected?: string;
  };
}

export interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  visitorCompany?: string;
  visitorLocation?: string;
  visitorBrowser?: string;
  status: 'active' | 'closed' | 'escalated';
  sentiment: 'positive' | 'neutral' | 'negative';
  leadCaptured: boolean;
  leadDetails?: Record<string, string>;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
