import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { InputField } from '../components/SharedUI';

const SIGNUP_IMAGES = [
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80", // Hiker
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80", // Swiss Alps Lake
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"  // Travel Backpacker
];

const SignupPage = ({ onSignup, onNavigate }: { onSignup: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Image Rotation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SIGNUP_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Container entrance - Zoom in slightly and fade up
    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 40, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // 2. Animate Title characters (Letter by letter reveal)
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(chars, 
        { y: 50, opacity: 0, rotateX: -90 }, 
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          stagger: 0.03, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        },
        "-=0.5"
      );
    }

    // 3. Animate Form Elements sequentially
    if (formRef.current) {
      const elements = formRef.current.children;
      tl.fromTo(elements,
        { x: -30, opacity: 0 }, // Coming from left for signup
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.6"
      );
    }

    // 4. Animate Visual Side elements
    tl.fromTo('.visual-content-anim',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: "power2.out" },
      "-=0.8"
    );

  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 1500);
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

      <div ref={containerRef} className="bg-white/80 backdrop-blur-xl w-full max-w-[1000px] rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white order-last md:order-first relative">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-50 rounded-tr-[4rem] -z-0"></div>
            
            <div className="w-full max-w-sm relative z-10">
            <div className="mb-8">
              <h1 ref={titleRef} className="text-3xl lg:text-4xl font-grotesk font-bold text-slate-900 mb-2 overflow-hidden pb-2">
                {splitText("Create Account")}
              </h1>
              <p className="text-slate-500 font-medium">Join us and start your journey today.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
              <div className="form-item">
                <InputField 
                    label="Full Name" 
                    type="text" 
                    placeholder="Jane Doe" 
                    required 
                    className="!bg-slate-50 border-slate-100 focus:!bg-white"
                    icon={<User size={18} className="text-slate-400" />} 
                />
              </div>
              <div className="form-item">
                <InputField 
                    label="Email" 
                    type="email" 
                    placeholder="jane@example.com" 
                    required 
                    className="!bg-slate-50 border-slate-100 focus:!bg-white"
                    icon={<Mail size={18} className="text-slate-400" />} 
                />
              </div>
              <div className="relative form-item">
                <InputField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="!bg-slate-50 border-slate-100 focus:!bg-white"
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none p-1">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>

              <div className="form-item pt-4">
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="group w-full py-4 bg-sky-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-sky-800 transition-all duration-300 shadow-xl shadow-sky-900/10 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                    <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                    {!isLoading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-800 to-sky-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center form-item">
              <p className="text-slate-400 text-sm font-medium">
                Already have an account? <button onClick={() => onNavigate('login')} className="font-bold text-sky-600 hover:underline">Log in</button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Visual */}
        <div className="w-full md:w-1/2 bg-sunset-500 relative p-12 flex flex-col justify-between overflow-hidden order-first md:order-last group">
          {/* Rotating Background Images - CRYSTAL CLEAR */}
          {SIGNUP_IMAGES.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            ></div>
          ))}

          {/* Clear Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sunset-900/90 via-sunset-800/50 to-transparent z-0"></div>
          
          <div className="relative z-10">
            <div className="visual-content-anim bg-white/20 backdrop-blur-md w-fit p-3 rounded-2xl mb-6 border border-white/20 shadow-lg">
              <Compass className="text-white" size={32} />
            </div>
            <h2 className="visual-content-anim text-4xl lg:text-5xl font-grotesk font-bold text-white mb-4 leading-tight drop-shadow-md">
                Start Your <br/> <span className="text-orange-200">Adventure.</span>
            </h2>
            <p className="visual-content-anim text-orange-50 text-lg max-w-sm font-medium drop-shadow-sm">Join thousands of travelers planning their next big trip.</p>
          </div>

          {/* Dynamic Indicators */}
          <div className="visual-content-anim relative z-10 flex gap-2">
             {SIGNUP_IMAGES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentImageIndex ? 'bg-white w-12' : 'bg-white/40 w-8 hover:bg-white/60'}`}
              ></button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;