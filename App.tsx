import React, { useState } from 'react';
import { GlobalAestheticBackground } from './components/SharedUI';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'faq' | 'blog' | 'features'>('landing');

  const handleNavigate = (page: string) => {
    setView(page as any);
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={() => setView('dashboard')} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onSignup={() => setView('dashboard')} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onLogout={() => setView('landing')} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'features':
        return <FeaturesPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <GlobalAestheticBackground />
      {renderView()}
    </div>
  );
}