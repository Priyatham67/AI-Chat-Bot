export type KnowledgeType = 'document' | 'website' | 'faq' | 'text';
export type KnowledgeStatus = 'indexed' | 'indexing' | 'error';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface KnowledgeSource {
  id: string;
  agentId: string;
  type: KnowledgeType;
  title: string;
  content: string;
  sourceUrl?: string;
  status: KnowledgeStatus;
  tokenCount: number;
  chunksCount: number;
  updatedAt: string;
  faqs?: FAQItem[];
}
