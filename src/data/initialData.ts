import { AIAgent } from '../types/agent';
import { KnowledgeSource } from '../types/knowledge';
import { Conversation } from '../types/chat';
import { Lead } from '../types/lead';

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'agent-apex-sales',
    name: 'Apex Cloud Sales Assistant',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'active',
    role: 'SaaS Sales & Solutions Specialist',
    industry: 'Cloud Software / B2B SaaS',
    tone: 'professional',
    language: 'English',
    temperature: 0.3,
    systemInstructions: `You are the primary AI Sales Consultant for Apex Cloud Solutions.
Your goal is to answer visitor questions regarding Apex Cloud infrastructure, pricing plans (Starter $49/mo, Growth $199/mo, Enterprise Custom), API scalability, SOC2 compliance, and migration options.
Always remain helpful, articulate, and proactive. When visitors ask about custom demos, high volume plans, or enterprise security, gently ask for their name, work email, and company name to schedule a 1-on-1 demo with our engineering team.`,
    fallbackMessage: 'I am not entirely sure about that specific detail, but I can connect you with one of our Cloud Architects or capture your email so our engineering team can follow up directly.',
    leadCaptureEnabled: true,
    leadFields: {
      name: true,
      email: true,
      phone: false,
      company: true,
      notes: true,
    },
    humanEscalationEnabled: true,
    escalationKeywords: ['human', 'speak to representative', 'agent', 'support call', 'complaint', 'refund'],
    widgetConfig: {
      themeColor: '#3b82f6',
      position: 'bottom-right',
      headerTitle: 'Apex Sales Concierge',
      headerSubtitle: 'Online • Asks us anything about Apex Cloud',
      launcherIcon: 'bot',
      welcomeMessage: '👋 Hi there! Welcome to Apex Cloud. How can I help you accelerate your cloud infrastructure today?',
      quickPrompts: [
        'What are your pricing plans?',
        'Is Apex Cloud SOC2 Compliant?',
        'How do I schedule a live product demo?',
        'How does API rate limiting work?'
      ]
    },
    stats: {
      totalConversations: 1420,
      leadsCaptured: 312,
      avgResponseTime: '1.2s',
      csat: 4.8,
      resolutionRate: 92,
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-07-28T14:30:00Z',
  },
  {
    id: 'agent-luxe-estate',
    name: 'LuxeHome Real Estate Advisor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    status: 'active',
    role: 'Property & Private Viewing Concierge',
    industry: 'Real Estate & Property Management',
    tone: 'friendly',
    language: 'English',
    temperature: 0.4,
    systemInstructions: `You are LuxeHome's automated luxury property advisor.
Assist home buyers and renters in discovering luxury listings, understanding neighborhood amenities, scheduling private walkthroughs, and connecting with mortgage specialists.
Keep tone warm, elegant, and informative. Collect contact details whenever a user asks to view a property or requests private pricing guides.`,
    fallbackMessage: 'I would love to check our private off-market listings for you. May I have your name and preferred contact email so a LuxeHome luxury agent can reach out?',
    leadCaptureEnabled: true,
    leadFields: {
      name: true,
      email: true,
      phone: true,
      company: false,
      notes: true,
    },
    humanEscalationEnabled: true,
    escalationKeywords: ['agent', 'realtor', 'broker', 'urgent', 'call me'],
    widgetConfig: {
      themeColor: '#059669',
      position: 'bottom-right',
      headerTitle: 'LuxeHome Advisor',
      headerSubtitle: 'Find your dream property',
      launcherIcon: 'home',
      welcomeMessage: '✨ Welcome to LuxeHome Properties. Are you looking to buy, rent, or schedule a private viewing today?',
      quickPrompts: [
        'Browse luxury homes in Downtown',
        'Schedule a private viewing',
        'What are the current mortgage rates?',
        'Speak with a certified broker'
      ]
    },
    stats: {
      totalConversations: 890,
      leadsCaptured: 215,
      avgResponseTime: '1.5s',
      csat: 4.9,
      resolutionRate: 95,
    },
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-07-30T11:15:00Z',
  },
  {
    id: 'agent-health-vital',
    name: 'HealthVital Patient Guide',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    status: 'active',
    role: 'Patient Care & Appointment Assistant',
    industry: 'Healthcare & Clinical Services',
    tone: 'empathic',
    language: 'English',
    temperature: 0.2,
    systemInstructions: `You are the friendly patient support bot for HealthVital Medical Center.
Answer questions about clinic hours, accepted health insurance providers, telehealth consultation steps, and pre-appointment guidelines.
Important Disclaimer: State that you provide general clinic information and are not providing medical diagnosis. For medical emergencies, advise calling emergency services immediately.`,
    fallbackMessage: 'For detailed medical scheduling or direct clinical inquiries, please let me take your name and contact phone number so our nursing reception can call you back.',
    leadCaptureEnabled: true,
    leadFields: {
      name: true,
      email: true,
      phone: true,
      company: false,
      notes: true,
    },
    humanEscalationEnabled: true,
    escalationKeywords: ['emergency', 'doctor', 'nurse', 'urgent care', 'pain'],
    widgetConfig: {
      themeColor: '#0d9488',
      position: 'bottom-right',
      headerTitle: 'HealthVital Care Support',
      headerSubtitle: '24/7 Clinic FAQ & Appointments',
      launcherIcon: 'heart-pulse',
      welcomeMessage: '🏥 Hello! How can HealthVital assist you with clinic hours, insurance check, or appointment booking today?',
      quickPrompts: [
        'Which insurance plans do you accept?',
        'What are clinic operating hours?',
        'How do telehealth appointments work?',
        'Book a specialist consultation'
      ]
    },
    stats: {
      totalConversations: 2150,
      leadsCaptured: 480,
      avgResponseTime: '0.9s',
      csat: 4.7,
      resolutionRate: 89,
    },
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-07-29T16:00:00Z',
  }
];

export const INITIAL_KNOWLEDGE: KnowledgeSource[] = [
  {
    id: 'ks-1',
    agentId: 'agent-apex-sales',
    type: 'document',
    title: 'Apex Cloud Product & Pricing Documentation 2026',
    status: 'indexed',
    tokenCount: 4200,
    chunksCount: 14,
    updatedAt: '2026-07-25T14:00:00Z',
    content: `Apex Cloud Platform Documentation:
1. STARTER PLAN ($49/month): Includes 2 Virtual Clusters, 500GB SSD NVMe storage, 5TB bandwidth/month, 99.9% uptime SLA, standard email support.
2. GROWTH PLAN ($199/month): Includes 8 Virtual Clusters, 2TB SSD NVMe storage, 25TB bandwidth/month, 99.99% uptime SLA, 24/7 chat support, auto-scaling worker groups.
3. ENTERPRISE PLAN (Custom Pricing starting $899/mo): Dedicated private cloud hardware, unlimited bandwidth, 99.999% uptime SLA, HIPAA & SOC2 Type II compliance, dedicated Account Manager.
4. SECURITY & COMPLIANCE: Apex Cloud is SOC2 Type II, ISO27001, and HIPAA certified. All data in transit is encrypted with TLS 1.3 and at rest with AES-256 keys.
5. MIGRATION SERVICES: Free zero-downtime migration assistant for AWS, Google Cloud, and Azure workloads.`
  },
  {
    id: 'ks-2',
    agentId: 'agent-apex-sales',
    type: 'faq',
    title: 'Apex Cloud Frequently Asked Questions',
    status: 'indexed',
    tokenCount: 1800,
    chunksCount: 6,
    updatedAt: '2026-07-26T09:30:00Z',
    content: 'Frequently Asked Questions regarding Apex Cloud deployments, trials, and billing.',
    faqs: [
      {
        id: 'faq-1',
        question: 'Do you offer a free trial for Apex Cloud?',
        answer: 'Yes! We offer a 14-day full feature free trial on the Starter and Growth plans with no credit card required.'
      },
      {
        id: 'faq-2',
        question: 'How do I migrate from AWS or DigitalOcean?',
        answer: 'Our automated Apex Migration CLI transfers databases, object storage, and container images with zero downtime.'
      },
      {
        id: 'faq-3',
        question: 'What is your uptime guarantee?',
        answer: 'Starter tier offers 99.9% uptime SLA, Growth offers 99.99%, and Enterprise tier guarantees 99.999% SLA with financial credits.'
      }
    ]
  },
  {
    id: 'ks-3',
    agentId: 'agent-luxe-estate',
    type: 'website',
    sourceUrl: 'https://luxehome-properties.example.com/listings',
    title: 'LuxeHome Active Listings Catalog & Policy',
    status: 'indexed',
    tokenCount: 3100,
    chunksCount: 10,
    updatedAt: '2026-07-27T16:20:00Z',
    content: `LuxeHome Properties Catalogue:
- Penthouse at Grand Marina: 4 Bed, 4.5 Bath, 4,200 sqft, Panoramic ocean view, Private infinity pool. Price: $4,850,000.
- Modern Villa Sunset Ridge: 5 Bed, 6 Bath, Smart home automation, Wine cellar, 3-car garage. Price: $3,200,000.
- Downtown Skyline Loft: 2 Bed, 2 Bath, High ceilings, floor-to-ceiling windows, fitness center access. Rent: $6,500/month.
- Viewings Policy: All private viewings require 24-hour advance booking and pre-approval or proof of funds for properties over $2M.`
  },
  {
    id: 'ks-4',
    agentId: 'agent-health-vital',
    type: 'document',
    title: 'HealthVital Clinic Services & Insurance Manual',
    status: 'indexed',
    tokenCount: 2900,
    chunksCount: 9,
    updatedAt: '2026-07-28T10:00:00Z',
    content: `HealthVital Medical Center Guide:
- Operating Hours: Monday - Friday: 7:00 AM - 8:00 PM; Saturday: 8:00 AM - 4:00 PM; Sunday: Closed for routine visits (Urgent Telehealth open 24/7).
- Accepted Insurance Providers: BlueCross BlueShield, Aetna, Cigna, UnitedHealthcare, Medicare, and Humana.
- Telehealth Services: Virtual consultations are conducted via encrypted HD video. Patients receive a link 15 minutes before the appointment.
- Emergency Notice: For acute chest pain, severe shortness of breath, or emergency trauma, call 911 immediately or visit the nearest ER.`
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    agentId: 'agent-apex-sales',
    agentName: 'Apex Cloud Sales Assistant',
    visitorName: 'David Miller',
    visitorEmail: 'david.m@techscale.io',
    visitorCompany: 'TechScale Inc.',
    visitorLocation: 'San Francisco, CA',
    visitorBrowser: 'Chrome 126.0 / macOS',
    status: 'active',
    sentiment: 'positive',
    leadCaptured: true,
    leadDetails: {
      name: 'David Miller',
      email: 'david.m@techscale.io',
      company: 'TechScale Inc.',
      notes: 'Interested in Growth Plan for 12 Kubernetes nodes migration.'
    },
    unread: false,
    createdAt: '2026-07-31T08:15:00Z',
    updatedAt: '2026-07-31T08:22:00Z',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-101',
        sender: 'agent',
        text: '👋 Hi there! Welcome to Apex Cloud. How can I help you accelerate your cloud infrastructure today?',
        timestamp: '2026-07-31T08:15:00Z',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-101',
        sender: 'user',
        text: 'Hi! We are looking to migrate 12 microservice clusters from AWS. What is your pricing and do you support zero-downtime migration?',
        timestamp: '2026-07-31T08:16:10Z',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-101',
        sender: 'agent',
        text: 'Hello David! Yes, our Growth Plan ($199/mo per cluster node) or Enterprise Tier includes our automated Apex Migration CLI designed specifically for zero-downtime container and database transfers. We also provide full SOC2 Type II compliance.',
        timestamp: '2026-07-31T08:16:45Z',
        ragSourcesUsed: [
          {
            sourceId: 'ks-1',
            sourceTitle: 'Apex Cloud Product & Pricing Documentation 2026',
            snippet: 'GROWTH PLAN ($199/month): Includes 8 Virtual Clusters... Free zero-downtime migration assistant'
          }
        ]
      },
      {
        id: 'msg-4',
        conversationId: 'conv-101',
        sender: 'user',
        text: 'That sounds great! Can I schedule a demo with a cloud architect to evaluate migration time?',
        timestamp: '2026-07-31T08:18:20Z',
      },
      {
        id: 'msg-5',
        conversationId: 'conv-101',
        sender: 'agent',
        text: 'I would be happy to set that up! I have captured your details for TechScale Inc. (david.m@techscale.io). One of our senior cloud architects will email you within 1 business hour with available demo slots.',
        timestamp: '2026-07-31T08:19:00Z',
        isLeadPrompt: true
      }
    ]
  },
  {
    id: 'conv-102',
    agentId: 'agent-luxe-estate',
    agentName: 'LuxeHome Real Estate Advisor',
    visitorName: 'Elena Rostova',
    visitorEmail: 'elena.rostova@designstudio.com',
    visitorPhone: '+1 (555) 234-5678',
    visitorLocation: 'Miami, FL',
    visitorBrowser: 'Safari 17.4 / iOS',
    status: 'escalated',
    sentiment: 'neutral',
    leadCaptured: true,
    leadDetails: {
      name: 'Elena Rostova',
      email: 'elena.rostova@designstudio.com',
      phone: '+1 (555) 234-5678',
      notes: 'Wants private viewing for Penthouse at Grand Marina ($4.85M).'
    },
    unread: true,
    createdAt: '2026-07-30T14:30:00Z',
    updatedAt: '2026-07-30T14:45:00Z',
    messages: [
      {
        id: 'msg-10',
        conversationId: 'conv-102',
        sender: 'agent',
        text: '✨ Welcome to LuxeHome Properties. Are you looking to buy, rent, or schedule a private viewing today?',
        timestamp: '2026-07-30T14:30:00Z',
      },
      {
        id: 'msg-11',
        conversationId: 'conv-102',
        sender: 'user',
        text: 'Is the Penthouse at Grand Marina still available for $4.85M? I would like to visit this Saturday.',
        timestamp: '2026-07-30T14:32:00Z',
      },
      {
        id: 'msg-12',
        conversationId: 'conv-102',
        sender: 'agent',
        text: 'Yes! The Penthouse at Grand Marina (4 Bed, 4.5 Bath, 4,200 sqft with private infinity pool) is active. Viewings require a 24-hour advance booking. I can connect you directly with a luxury broker.',
        timestamp: '2026-07-30T14:33:00Z',
        ragSourcesUsed: [
          {
            sourceId: 'ks-3',
            sourceTitle: 'LuxeHome Active Listings Catalog & Policy',
            snippet: 'Penthouse at Grand Marina: 4 Bed, 4.5 Bath, 4,200 sqft... Price: $4,850,000.'
          }
        ]
      },
      {
        id: 'msg-13',
        conversationId: 'conv-102',
        sender: 'user',
        text: 'Please connect me to an agent right now.',
        timestamp: '2026-07-30T14:40:00Z'
      },
      {
        id: 'msg-14',
        conversationId: 'conv-102',
        sender: 'agent',
        text: '🔔 Transferring this conversation to a senior broker. Elena, an agent will join this chat thread or call +1 (555) 234-5678 shortly.',
        timestamp: '2026-07-30T14:40:05Z',
        isEscalationNotice: true
      }
    ]
  },
  {
    id: 'conv-103',
    agentId: 'agent-health-vital',
    agentName: 'HealthVital Patient Guide',
    visitorName: 'Marcus Vance',
    visitorEmail: 'm.vance@gmail.com',
    visitorPhone: '+1 (555) 987-6543',
    visitorLocation: 'Austin, TX',
    visitorBrowser: 'Firefox 128.0 / Windows',
    status: 'closed',
    sentiment: 'positive',
    leadCaptured: true,
    leadDetails: {
      name: 'Marcus Vance',
      email: 'm.vance@gmail.com',
      notes: 'Asked about BlueCross BlueShield coverage for telehealth.'
    },
    unread: false,
    createdAt: '2026-07-29T11:00:00Z',
    updatedAt: '2026-07-29T11:12:00Z',
    messages: [
      {
        id: 'msg-20',
        conversationId: 'conv-103',
        sender: 'agent',
        text: '🏥 Hello! How can HealthVital assist you with clinic hours, insurance check, or appointment booking today?',
        timestamp: '2026-07-29T11:00:00Z',
      },
      {
        id: 'msg-21',
        conversationId: 'conv-103',
        sender: 'user',
        text: 'Do you accept BlueCross BlueShield for virtual telehealth doctor appointments?',
        timestamp: '2026-07-29T11:02:00Z',
      },
      {
        id: 'msg-22',
        conversationId: 'conv-103',
        sender: 'agent',
        text: 'Yes, BlueCross BlueShield is fully accepted for our telehealth and in-person consultations! You will receive a video link 15 minutes before your booked appointment.',
        timestamp: '2026-07-29T11:02:30Z',
        ragSourcesUsed: [
          {
            sourceId: 'ks-4',
            sourceTitle: 'HealthVital Clinic Services & Insurance Manual',
            snippet: 'Accepted Insurance Providers: BlueCross BlueShield, Aetna... Telehealth Services via encrypted HD video.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    agentId: 'agent-apex-sales',
    agentName: 'Apex Cloud Sales Assistant',
    conversationId: 'conv-101',
    name: 'David Miller',
    email: 'david.m@techscale.io',
    company: 'TechScale Inc.',
    notes: 'Migrating 12 microservice clusters from AWS. Requested live demo.',
    status: 'qualified',
    createdAt: '2026-07-31T08:19:00Z',
    intentScore: 94,
  },
  {
    id: 'lead-2',
    agentId: 'agent-luxe-estate',
    agentName: 'LuxeHome Real Estate Advisor',
    conversationId: 'conv-102',
    name: 'Elena Rostova',
    email: 'elena.rostova@designstudio.com',
    phone: '+1 (555) 234-5678',
    notes: 'Private viewing request for Penthouse at Grand Marina ($4.85M). Escalated to human broker.',
    status: 'new',
    createdAt: '2026-07-30T14:40:00Z',
    intentScore: 98,
  },
  {
    id: 'lead-3',
    agentId: 'agent-health-vital',
    agentName: 'HealthVital Patient Guide',
    conversationId: 'conv-103',
    name: 'Marcus Vance',
    email: 'm.vance@gmail.com',
    phone: '+1 (555) 987-6543',
    notes: 'Inquired about BlueCross BlueShield coverage for telehealth.',
    status: 'contacted',
    createdAt: '2026-07-29T11:10:00Z',
    intentScore: 82,
  }
];
