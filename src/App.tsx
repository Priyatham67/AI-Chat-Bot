import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AgentStudio } from './components/AgentStudio';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LiveConversations } from './components/LiveConversations';
import { LeadsDirectory } from './components/LeadsDirectory';
import { AnalyticsStudio } from './components/AnalyticsStudio';
import { EmbedWidgetStudio } from './components/EmbedWidgetStudio';
import { PlaygroundSandbox } from './components/PlaygroundSandbox';
import { ChatbotWidget } from './components/ChatbotWidget';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'agents' && <Dashboard />}
      {activeTab === 'builder' && <AgentStudio />}
      {activeTab === 'knowledge' && <KnowledgeBase />}
      {activeTab === 'conversations' && <LiveConversations />}
      {activeTab === 'leads' && <LeadsDirectory />}
      {activeTab === 'analytics' && <AnalyticsStudio />}
      {activeTab === 'embed' && <EmbedWidgetStudio />}
      {activeTab === 'playground' && <PlaygroundSandbox />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white antialiased">
        <Navigation />
        <MainContent />
        <ChatbotWidget />
      </div>
    </AppProvider>
  );
}
