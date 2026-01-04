import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { InputField } from '../components/SharedUI';

const LOGIN_IMAGES = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80", // Aerial Wing
  "https://images.unsplash.com/photo-1556388169-db19adc96088?auto=format&fit=crop&q=80", // Modern Terminal
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"  // Luxury Resort
];

const LoginPage = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Image Rotation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % LOGIN_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Container entrance
    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 40, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // 2. Animate Title characters
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(chars, 
        { y: 50, opacity: 0, rotateX: -90 }, 
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          stagger: 0.05, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        },
        "-=0.4"
      );
    }

    // 3. Animate Form Elements sequentially
    if (formRef.current) {
      const elements = formRef.current.children;
      tl.fromTo(elements,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.6"
      );
    }

    // 4. Animate left side content
    tl.fromTo('.left-content-anim',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 },
      "-=0.8"
    );

  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Temporary Credentials Validation
    if (email === 'user@exploremate.com' && password === '123456') {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1500);
    } else {
      setError('Invalid credentials. Please try again.');
      // Shake animation for error
      if (formRef.current) {
        gsap.fromTo(formRef.current, 
          { x: -10 }, 
          { x: 10, duration: 0.1, repeat: 5, yoyo: true, clearProps: 'x' }
        );
      }
    }
  };

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block whitespace-pre relative">
        {char}
      </span>
    ));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10">
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold z-50 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md"
      >
        <ArrowRight size={18} className="rotate-180" /> Back to Home
      </button>

      <div ref={containerRef} className="bg-white/90 backdrop-blur-xl w-full max-w-[1000px] rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side Visual */}
        <div className="w-full md:w-1/2 bg-sky-900 relative p-12 flex flex-col justify-between overflow-hidden group">
          {/* Rotating Background Images */}
          {LOGIN_IMAGES.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            ></div>
          ))}
          
          {/* Clear Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900 via-sky-900/60 to-transparent z-0"></div>
          
          <div className="relative z-10">
            <div className="left-content-anim bg-white/20 backdrop-blur-md w-fit p-4 rounded-2xl mb-8 border border-white/20 shadow-lg">
              <Compass className="text-white" size={32} />
            </div>
            <h2 className="left-content-anim text-4xl lg:text-5xl font-grotesk font-bold text-white mb-6 leading-tight drop-shadow-md">
              Your Journey <br/> 
              <span className="text-sky-200">Begins Here.</span>
            </h2>
            <p className="left-content-anim text-sky-50 text-lg max-w-sm leading-relaxed drop-shadow-sm font-medium">
              Log in to access your AI-curated itineraries, saved gems, and personal travel dashboard.
            </p>
          </div>

          {/* Dynamic Indicators */}
          <div className="relative z-10 flex gap-2 left-content-anim">
            {LOGIN_IMAGES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentImageIndex ? 'bg-white w-12' : 'bg-white/40 w-8 hover:bg-white/60'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center bg-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[4rem] -z-0"></div>
          
          <div className="w-full max-w-sm relative z-10">
            <div className="mb-8">
              <h1 ref={titleRef} className="text-4xl lg:text-5xl font-grotesk font-bold text-slate-900 mb-3 tracking-tight overflow-hidden pb-2">
                {splitText("Welcome Back")}
              </h1>
              <p className="text-slate-500 font-medium">Please enter your details to continue.</p>
              
              {/* Credential Hint */}
              <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 flex flex-col gap-1">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12}/> Demo Credentials</span>
                <span className="font-mono">Email: user@exploremate.com</span>
                <span className="font-mono">Pass: 123456</span>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
              <div className="form-item">
                <InputField 
                  label="Email Address" 
                  type="email" 
                  placeholder="nomad@example.com" 
                  required 
                  className={`!bg-slate-50 focus:!bg-white ${error ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative form-item">
                <InputField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className={`!bg-slate-50 focus:!bg-white ${error ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none p-1">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm font-bold flex items-center gap-2 animate-pulse">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="form-item flex justify-end pb-4 pt-2">
                 <button type="button" className="text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors">Forgot Password?</button>
              </div>

              <div className="form-item">
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="group w-full py-4 bg-slate-900 text-white rounded-2xl font-bold font-grotesk tracking-wide text-lg hover:bg-sky-600 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-sky-200 flex items-center justify-center gap-2 overflow-hidden relative"
                >
                  <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                  {!isLoading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
            
            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Don't have an account? <button onClick={() => onNavigate('signup')} className="font-bold text-sky-600 hover:underline">Create free account</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;