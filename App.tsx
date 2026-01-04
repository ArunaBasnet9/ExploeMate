import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plane } from 'lucide-react';
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
import ProfilePage from './pages/ProfilePage';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // Entry
      tl.fromTo(logoRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      )
      .fromTo(textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(subTextRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Exit Sequence
      tl.to(logoRef.current, {
         scale: 0.8,
         duration: 0.3,
         ease: "power2.in",
         delay: 0.8
      })
      .to(logoRef.current, {
         x: '100vw',
         y: -200,
         rotation: 45,
         scale: 1.5,
         duration: 1.2,
         ease: "power2.in"
      })
      .to([textRef.current, subTextRef.current], {
         opacity: 0,
         y: -20,
         duration: 0.4,
         stagger: 0.1
      }, "<")
      .to(containerRef.current, {
         yPercent: -100,
         duration: 1,
         ease: "power4.inOut"
      }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-sky-950 flex flex-col items-center justify-center text-white overflow-hidden">
       {/* Decorative backgrounds */}
       <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-sky-600/30 rounded-full blur-[120px] animate-pulse"></div>
       <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
       
       {/* Particles */}
       <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
             <div key={i} className="absolute bg-white rounded-full" 
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    animation: `float ${Math.random() * 10 + 10}s infinite linear`
                  }}
             />
          ))}
       </div>

       <div className="relative z-10 flex flex-col items-center">
          <div ref={logoRef} className="bg-white p-6 rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.3)] mb-8 text-sky-600">
             <Plane size={64} fill="currentColor" strokeWidth={1.5} />
          </div>
          <h1 ref={textRef} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-200">
             ExploreMate
          </h1>
          <p ref={subTextRef} className="text-sky-200/80 text-lg md:text-xl font-medium tracking-wide uppercase">
             Your Journey Begins Here
          </p>
       </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'faq' | 'blog' | 'features' | 'saved' | 'trips' | 'profile'>('landing');
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
      case 'profile':
        return <ProfilePage onLogout={handleLogout} onNavigate={handleNavigate} />;
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
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <GlobalAestheticBackground />
      <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
         {renderView()}
      </div>
    </div>
  );
}