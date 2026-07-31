export interface Lead {
  id: string;
  agentId: string;
  agentName: string;
  conversationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
  intentScore: number; // 0-100
}
