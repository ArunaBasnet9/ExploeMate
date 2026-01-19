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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import SavedPage from './pages/SavedPage';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import RouteOptimizerPage from './pages/RouteOptimizerPage';
import TranslatorPage from './pages/TranslatorPage';
import QRGuidePage from './pages/QRGuidePage';
import GroupPlanPage from './pages/GroupPlanPage';
import AISuggestionPage from './pages/AISuggestionPage';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const loaderRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            gsap.to(containerRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete
            });
        }
      });

      // --- Setup ---
      const path = pathRef.current;
      const length = path?.getTotalLength() || 0;
      
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
      gsap.set(".splash-char", { y: 100, opacity: 0, rotateX: -90 });
      gsap.set(".star", { opacity: 0, scale: 0 });
      
      // Setup Loader Ring
      if (loaderRef.current) {
          const circumference = 2 * Math.PI * 22; // r=22
          gsap.set(loaderRef.current, { strokeDasharray: circumference, strokeDashoffset: circumference });
      }

      // --- Animation Sequence ---

      // 0. Stars Twinkle
      tl.to(".star", {
        opacity: "random(0.3, 1)",
        scale: "random(0.5, 1.5)",
        duration: 1.5,
        stagger: { amount: 1, from: "random" },
        ease: "power1.out"
      }, 0);

      // 1. Draw Path & Move Plane & Fill Loader
      const progress = { value: 0 };
      
      tl.to(path, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power2.inOut"
      }, 0);
      
      // Animate Circular Loader stroke
      if (loaderRef.current) {
          tl.to(loaderRef.current, {
              strokeDashoffset: 0,
              duration: 2.5,
              ease: "power2.inOut"
          }, 0);
      }

      tl.to(progress, {
          value: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onUpdate: () => {
              if (path && planeRef.current) {
                  // Get point at current progress
                  const point = path.getPointAtLength(progress.value * length);
                  
                  // Calculate angle for rotation (look slightly ahead)
                  const lookAhead = Math.min(progress.value * length + 1, length);
                  const lookBehind = Math.max(0, progress.value * length - 1);
                  const p1 = path.getPointAtLength(lookBehind);
                  const p2 = path.getPointAtLength(lookAhead);
                  
                  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
                  
                  gsap.set(planeRef.current, {
                      x: point.x,
                      y: point.y,
                      rotation: angle
                  });
              }
          }
      }, 0);

      // 2. Reveal Text (Staggered 3D flip)
      tl.to(".splash-char", {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "back.out(1.7)"
      }, "-=1.5");

      // 3. Pulse the plane at the end
      tl.to(planeRef.current, {
          scale: 1.5,
          boxShadow: "0 0 60px rgba(14, 165, 233, 0.8)",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const text = "ExploreMate";
  const chars = text.split("").map((char, i) => (
      <span key={i} className="splash-char inline-block origin-bottom font-display font-bold text-5xl md:text-7xl text-white drop-shadow-2xl">
          {char}
      </span>
  ));

  // Generate random stars
  const stars = Array.from({ length: 30 }).map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
  }));

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-950 to-slate-950 animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
        </div>

        {/* Stars */}
        {stars.map((star, i) => (
            <div key={i} className="star absolute w-1 h-1 bg-white rounded-full" style={{ top: star.top, left: star.left }}></div>
        ))}

        {/* Flight Path SVG */}
        <svg className="absolute w-full h-full pointer-events-none opacity-60" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="flightPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(14, 165, 233, 0)" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {/* Dynamic S-Curve Path */}
            <path 
                ref={pathRef}
                d="M -100,500 C 300,500 400,100 600,100 S 900,300 1200,200"
                fill="none" 
                stroke="url(#flightPathGradient)" 
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
            />
        </svg>

        {/* Plane Object */}
        <div ref={planeRef} className="absolute top-0 left-0 -ml-10 -mt-10 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.6)] z-20">
            {/* Rotate inner icon -45deg so it points right (0deg) by default to match path calculation */}
            <Plane className="text-sky-600 transform -rotate-45" size={40} strokeWidth={2.5} />
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center">
            <div className="flex space-x-1 mb-8 overflow-hidden perspective-text">
                {chars}
            </div>
            
            {/* Modern Circular Loader */}
            <div className="relative w-16 h-16">
                {/* Rotating Outer Glow */}
                <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl animate-pulse"></div>
                
                {/* SVG Ring System */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track - Subtle Fade */}
                    <circle
                        cx="32"
                        cy="32"
                        r="22"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="4"
                        fill="none"
                    />
                    {/* Animated Progress Ring */}
                    <circle
                        ref={loaderRef}
                        cx="32"
                        cy="32"
                        r="22"
                        stroke="#0ea5e9"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                    />
                </svg>
                {/* Removed inner white spinner and dot as requested */}
            </div>
        </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'about' | 'faq' | 'news' | 'features' | 'saved' | 'trips' | 'profile' | 'notifications' | 'route-optimizer' | 'translator' | 'qr-guide' | 'group-plan' | 'ai-suggestion'>('landing');
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
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
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
      case 'qr-guide':
        return <QRGuidePage onNavigate={handleNavigate} />;
      case 'group-plan':
        return <GroupPlanPage onNavigate={handleNavigate} />;
      case 'ai-suggestion':
        return <AISuggestionPage onNavigate={handleNavigate} />;
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