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
import SavedPage from './pages/SavedPage';
import TripsPage from './pages/TripsPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'faq' | 'blog' | 'features' | 'saved' | 'trips'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (page: string) => {
    setView(page as any);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'saved':
        return <SavedPage onLogout={handleLogout} onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'trips':
        return <TripsPage onLogout={handleLogout} onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'features':
        return <FeaturesPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      default:
        return <LandingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <GlobalAestheticBackground />
      {renderView()}
    </div>
  );
}