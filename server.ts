import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to safely get Gemini AI Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY is not set or using placeholder.');
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasGemini = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    geminiConfigured: hasGemini,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint (Runs AI Chatbot turn with RAG & System Prompt)
app.post('/api/chat', async (req, res) => {
  try {
    const { agent, userMessage, conversationHistory = [], knowledgeSources = [], visitorInfo = {} } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'userMessage string is required' });
    }

    const ai = getGeminiClient();

    // Prepare Knowledge Context (RAG Simulation / Knowledge Base Lookup)
    let knowledgeContext = '';
    const matchingSources: { sourceId: string; sourceTitle: string; snippet: string }[] = [];

    if (knowledgeSources && knowledgeSources.length > 0) {
      knowledgeSources.forEach((src: any) => {
        if (src.content && src.content.trim()) {
          const snippet = src.content.slice(0, 800);
          knowledgeContext += `\n--- SOURCE: ${src.title} (${src.type}) ---\n${src.content}\n`;
          matchingSources.push({
            sourceId: src.id,
            sourceTitle: src.title,
            snippet: snippet.slice(0, 180) + '...',
          });
        }
        if (src.faqs && src.faqs.length > 0) {
          src.faqs.forEach((faq: any) => {
            knowledgeContext += `\nFAQ Q: ${faq.question}\nFAQ A: ${faq.answer}\n`;
          });
        }
      });
    }

    // System prompt construction
    const systemPrompt = `You are ${agent?.name || 'an AI Assistant'}, working in the role of "${agent?.role || 'Customer Support Assistant'}" in the "${agent?.industry || 'Customer Service'}" industry.
Tone: ${agent?.tone || 'professional'}.
Primary Language: ${agent?.language || 'English'}.

Your Core Instructions:
${agent?.systemInstructions || 'Provide accurate, helpful, and polite answers.'}

Fallback Rule:
If you do not find the exact answer in the knowledge base or are uncertain, present this fallback behavior politely:
"${agent?.fallbackMessage || 'I do not have that exact information on hand, but I can collect your details for our team to assist.'}"

Lead Capture Rule:
${agent?.leadCaptureEnabled ? 'Lead capture is enabled. If the user expresses buying intent, demo interest, or contact request, gently ask for their details (Name, Email, Company, Phone as appropriate).' : 'Do not aggressively ask for leads unless requested.'}

Human Escalation Rule:
${agent?.humanEscalationEnabled ? `If the user explicitly asks for a human, live rep, or expresses high frustration (keywords: ${(agent?.escalationKeywords || []).join(', ')}), acknowledge calmly and notify them that you are transferring them to a live representative.` : ''}

Knowledge Base Context:
${knowledgeContext ? knowledgeContext : 'No specific knowledge articles attached. Rely on general professional knowledge.'}

Task:
Respond directly to the user's latest message in character.
Return your response in a raw JSON format matching this schema:
{
  "responseText": "Your complete textual response to the customer",
  "sentiment": "positive" | "neutral" | "negative",
  "intentDetected": "short string describing user intent e.g. pricing, demo, faq, lead_provided, escalation",
  "isEscalationTriggered": boolean,
  "sourcesUsed": ["titles of knowledge sources referenced"],
  "leadCapturedData": { "name": "...", "email": "...", "phone": "...", "company": "...", "notes": "..." } // only fill if the user explicitly provided lead details in their message
}
`;

    // History formatting
    const formattedContents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.sender === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.sender === 'agent') {
          formattedContents.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      });
    }
    formattedContents.push({ role: 'user', parts: [{ text: userMessage }] });

    if (!ai) {
      // Fallback local response if Gemini API key is missing
      const isEscalate = (agent?.escalationKeywords || []).some((kw: string) =>
        userMessage.toLowerCase().includes(kw.toLowerCase())
      );

      let responseText = `Thank you for reaching out! ${agent?.fallbackMessage || 'How else may I help you today?'}`;
      if (knowledgeContext && knowledgeContext.toLowerCase().includes(userMessage.toLowerCase().split(' ')[0])) {
        responseText = `Based on our company knowledge base: We have detailed options for your query regarding "${userMessage}". Let us know if you need specific details or a direct consultation!`;
      }

      return res.json({
        responseText,
        sentiment: 'neutral',
        intentDetected: isEscalate ? 'escalation' : 'general_inquiry',
        isEscalationTriggered: isEscalate,
        sourcesUsed: matchingSources.slice(0, 1).map((s) => s.sourceTitle),
        ragSourcesUsed: matchingSources.slice(0, 1),
      });
    }

    // Call Gemini Model
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: agent?.temperature ?? 0.3,
        responseMimeType: 'application/json',
      },
    });

    const rawText = geminiResponse.text || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText.trim());
    } catch (e) {
      parsed = { responseText: rawText, sentiment: 'neutral' };
    }

    // Match used sources
    const usedSourceObjs = matchingSources.filter(
      (src) => (parsed.sourcesUsed || []).includes(src.sourceTitle) || matchingSources.length === 1
    );

    res.json({
      responseText: parsed.responseText || agent?.fallbackMessage || 'How can I assist you further?',
      sentiment: parsed.sentiment || 'neutral',
      intentDetected: parsed.intentDetected || 'general_inquiry',
      isEscalationTriggered: !!parsed.isEscalationTriggered,
      sourcesUsed: parsed.sourcesUsed || [],
      ragSourcesUsed: usedSourceObjs.length > 0 ? usedSourceObjs : matchingSources.slice(0, 1),
      leadCapturedData: parsed.leadCapturedData || null,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'Failed to generate chatbot response',
      message: err.message,
    });
  }
});

// Endpoint to generate/enhance AI Agent instructions & configuration using Gemini
app.post('/api/agent/generate-instructions', async (req, res) => {
  try {
    const { name, role, industry, tone, goals } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        systemInstructions: `You are ${name || 'an AI Agent'}, working as a ${role || 'Customer Support Specialist'} in the ${industry || 'General'} industry. Your goal is to deliver clear, professional, and helpful answers. Always maintain a ${tone || 'friendly'} tone and assist visitors effectively.`,
        welcomeMessage: `👋 Hello! I am ${name || 'your AI assistant'}. How can I assist you with ${industry || 'our services'} today?`,
        fallbackMessage: `I want to make sure you get the exact answer you need. May I have your email so our team can follow up directly?`,
        quickPrompts: [
          'What services do you offer?',
          'How do I get started?',
          'How can I contact sales or support?',
          'What are your operating hours?'
        ]
      });
    }

    const prompt = `Create tailored agent instructions and widget setup for an AI Chatbot:
Agent Name: ${name || 'Customer Assistant'}
Role: ${role || 'Sales & Support Assistant'}
Industry: ${industry || 'Technology'}
Tone: ${tone || 'professional'}
Goals: ${goals || 'Answer questions, capture qualified leads, schedule appointments'}

Return JSON:
{
  "systemInstructions": "Comprehensive 3-paragraph system instruction prompt for the model defining behavior, edge-case handling, and domain guidelines",
  "welcomeMessage": "Friendly welcoming greeting message for the chat widget",
  "fallbackMessage": "Polite fallback message when knowledge is missing",
  "quickPrompts": ["4 concise starter prompts visitors can click"]
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/agent/generate-instructions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to process document/URL/text into Knowledge Base chunks & FAQs
app.post('/api/knowledge/process', async (req, res) => {
  try {
    const { title, content, type, sourceUrl } = req.body;
    const ai = getGeminiClient();

    const estimatedWords = (content || '').split(/\s+/).length;
    const tokenCount = Math.round(estimatedWords * 1.3);
    const chunksCount = Math.max(1, Math.ceil(estimatedWords / 200));

    if (!ai) {
      return res.json({
        title: title || 'Processed Knowledge Source',
        content,
        tokenCount,
        chunksCount,
        summary: `Indexed ${estimatedWords} words across ${chunksCount} knowledge chunks.`,
        faqs: [
          {
            id: 'faq-gen-1',
            question: `What key topic is covered in ${title}?`,
            answer: content ? content.slice(0, 150) + '...' : 'Overview of company policies and guidelines.'
          }
        ]
      });
    }

    const prompt = `Analyze this knowledge base material (${title}, ${type}):
${content.slice(0, 3000)}

Generate JSON:
{
  "summary": "1-2 sentence overview of what this knowledge source covers",
  "faqs": [
    { "question": "Question 1 derived from content", "answer": "Clear concise answer" },
    { "question": "Question 2 derived from content", "answer": "Clear concise answer" },
    { "question": "Question 3 derived from content", "answer": "Clear concise answer" }
  ]
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');
    res.json({
      title: title || 'Knowledge Source',
      content,
      tokenCount,
      chunksCount,
      summary: parsed.summary || 'Indexed knowledge source successfully.',
      faqs: (parsed.faqs || []).map((item: any, idx: number) => ({
        id: `faq-gen-${idx}-${Date.now()}`,
        question: item.question,
        answer: item.answer,
      })),
    });
  } catch (err: any) {
    console.error('Error in /api/knowledge/process:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for AI Analytics & Knowledge Gap Insights
app.post('/api/analytics/insights', async (req, res) => {
  try {
    const { agentName, conversations = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        topFrictionPoints: [
          'High demand for live human escalation during weekend hours',
          'Users frequently ask for custom enterprise SLA details not present in base document',
          'Inquiries regarding native integration with Salesforce CRM'
        ],
        knowledgeGaps: [
          'Missing updated Q3 2026 product roadmap documentation',
          'Need detailed FAQ on international multi-currency billing'
        ],
        recommendations: [
          'Add a dedicated FAQ source for API rate limits and Webhook setup',
          'Enable lead capture form auto-prompting after 2 consecutive technical inquiries'
        ]
      });
    }

    const sampleChats = conversations.slice(0, 10).map((c: any) =>
      c.messages ? c.messages.map((m: any) => `${m.sender}: ${m.text}`).join('\n') : ''
    ).join('\n---\n');

    const prompt = `You are an AI Analytics Auditor evaluating chatbot performance for agent "${agentName || 'AI Assistant'}".
Examine these conversation transcripts:
${sampleChats.slice(0, 4000)}

Generate JSON:
{
  "topFrictionPoints": ["3 specific customer friction points or confusion areas"],
  "knowledgeGaps": ["2 key missing topics or document gaps in the knowledge base"],
  "recommendations": ["2 actionable recommendations to improve CSAT and lead conversion"]
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(geminiRes.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/analytics/insights:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE / STATIC SERVING MIDDLEWARE
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
