export type AgentTone = 'professional' | 'friendly' | 'concise' | 'enthusiastic' | 'empathic' | 'formal';

export interface LeadFieldsConfig {
  name: boolean;
  email: boolean;
  phone: boolean;
  company: boolean;
  notes: boolean;
}

export interface WidgetConfig {
  themeColor: string;
  position: 'bottom-right' | 'bottom-left';
  headerTitle: string;
  headerSubtitle: string;
  launcherIcon: string;
  welcomeMessage: string;
  quickPrompts: string[];
  customCSS?: string;
}

export interface AgentStats {
  totalConversations: number;
  leadsCaptured: number;
  avgResponseTime: string;
  csat: number; // 0 to 5
  resolutionRate: number; // percentage e.g. 94
}

export interface AIAgent {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'active' | 'draft' | 'paused';
  role: string;
  industry: string;
  tone: AgentTone;
  language: string;
  temperature: number; // 0.0 to 1.0
  systemInstructions: string;
  fallbackMessage: string;
  leadCaptureEnabled: boolean;
  leadFields: LeadFieldsConfig;
  humanEscalationEnabled: boolean;
  escalationKeywords: string[];
  widgetConfig: WidgetConfig;
  stats: AgentStats;
  createdAt: string;
  updatedAt: string;
}
