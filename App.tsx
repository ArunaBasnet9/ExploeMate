import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plane, MapPin } from 'lucide-react';
import { GlobalAestheticBackground } from './components/SharedUI';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import SavedPage from './pages/SavedPage';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import RouteOptimizerPage from './pages/RouteOptimizerPage';
import TranslatorPage from './pages/TranslatorPage';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // 0. Initial States
      gsap.set(containerRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
      
      // 1. Draw Flight Path
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        
        tl.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut"
        });
      }

      // 2. Plane Entrance (following the path visually)
      tl.fromTo(planeRef.current,
        { x: -100, y: 50, opacity: 0, scale: 0.5, rotation: -15 },
        { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)" },
        "-=1.0"
      );

      // 3. Text Reveal (Masked Slide Up)
      tl.fromTo(textRef.current?.children || [],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // 4. Progress Bar (Without Text)
      tl.to(progressRef.current, {
        width: "100%",
        duration: 1.5,
        ease: "expo.inOut"
      }, "-=0.8");
      
      // 5. Exit Sequence (Cinematic Slide Up with Parallax)
      // Move elements slightly down while container moves up
      tl.to([planeRef.current, textRef.current], {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in"
      }, "+=0.2");

      tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1,
        ease: "power4.inOut"
      }, "-=0.6");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden">
       {/* Background Aurora Effects */}
       <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-sky-600/20 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-purple-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }}></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
       </div>

       {/* SVG Path Background */}
       <svg className="absolute inset-0 w-full h-full z-0 opacity-30 pointer-events-none">
          <path 
            ref={pathRef}
            d="M -100,500 Q 400,200 800,500 T 2000,300" 
            fill="none" 
            stroke="url(#gradient)" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0)" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
            </linearGradient>
          </defs>
       </svg>

       <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
          {/* Logo Container */}
          <div ref={planeRef} className="relative mb-8">
             <div className="absolute inset-0 bg-sky-500 blur-2xl opacity-20 rounded-full"></div>
             <div className="w-24 h-24 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.4)] border border-white/20 relative z-10">
                <Plane size={48} className="text-white transform -rotate-45" strokeWidth={1.5} />
             </div>
             {/* Decorative pin indicating destination */}
             <div className="absolute -top-4 -right-4 bg-white text-sky-600 p-2 rounded-full shadow-lg animate-bounce">
                <MapPin size={16} fill="currentColor" />
             </div>
          </div>

          {/* Text Container */}
          <div ref={textRef} className="text-center mb-12">
             <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-2">
               <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">Explore</span>
               <span className="inline-block text-sky-500">Mate</span>
             </h1>
             <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">
               AI-Powered Travel Companion
             </p>
          </div>

          {/* Loading System - Minimalist Bar */}
          <div className="w-full relative mt-4 px-8">
             <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div ref={progressRef} className="h-full bg-gradient-to-r from-sky-400 to-blue-600 w-0 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)]"></div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'faq' | 'news' | 'features' | 'saved' | 'trips' | 'profile' | 'notifications' | 'route-optimizer' | 'translator'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Request Permissions on App Start
  useEffect(() => {
    const requestPermissions = async () => {
      // 1. Geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => console.log("Location granted:", pos.coords),
          (err) => console.warn("Location denied or error:", err)
        );
      }

      // 2. Camera & Microphone
      // Attempt to request media permissions. Note: Browsers may block this without user interaction.
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Camera and Microphone granted");
      } catch (err) {
        console.warn("Camera/Microphone denied or requires interaction:", err);
      }
    };

    requestPermissions();
  }, []);

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
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;
      case 'route-optimizer':
        return <RouteOptimizerPage onNavigate={handleNavigate} />;
      case 'translator':
        return <TranslatorPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
      case 'news':
        return <NewsPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
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
      {/* We remove opacity transition here because the splash screen handles the reveal via clip-path */}
      <div className="relative z-0">
         {renderView()}
      </div>
    </div>
  );
}
