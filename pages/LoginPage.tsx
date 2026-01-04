import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, User, Lock, MapPin, AlertCircle } from 'lucide-react';
import { InputField } from '../components/SharedUI';
import { LOGIN_IMAGES } from '../assets/images';

// Nepal Specific Slides for Login
const LOGIN_SLIDES = [
  {
    id: 1,
    image: LOGIN_IMAGES.EVEREST,
    title: "Summit the World",
    location: "Mt. Everest, Solukhumbu",
    description: "Experience the breathtaking heights of the Himalayas."
  },
  {
    id: 2,
    image: LOGIN_IMAGES.BOUDHANATH,
    title: "Spiritual Awakening",
    location: "Boudhanath, Kathmandu",
    description: "Find peace in the heart of ancient culture."
  },
  {
    id: 3,
    image: LOGIN_IMAGES.POKHARA,
    title: "Serenity Awaits",
    location: "Phewa Lake, Pokhara",
    description: "Reflect on nature's beauty by the tranquil waters."
  }
];

const LoginPage = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOGIN_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Initial Animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    if (formRef.current) {
      tl.fromTo(formRef.current.children,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call with specific credentials check
    setTimeout(() => {
      if (email === 'rashojban@gmail.com' && password === '12345') {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Please use the temporary login.');
        // Error Shake Animation
        if (formRef.current) {
          gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.1, repeat: 5, yoyo: true });
        }
      }
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10 bg-slate-50">
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm"
      >
        <ArrowRight size={18} className="rotate-180" /> Back to Home
      </button>

      <div ref={containerRef} className="bg-white w-full max-w-[1100px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="max-w-sm mx-auto w-full relative z-10">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-bold text-xs uppercase tracking-wider mb-6 border border-sky-100">
                <Compass size={14} /> Welcome Back
              </div>
              <h1 className="text-4xl font-grotesk font-bold text-slate-900 mb-3">
                Log In to <br/> ExploreMate
              </h1>
              <p className="text-slate-500 font-medium">
                Continue your journey through the Himalayas.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <InputField 
                label="Email Address" 
                type="email" 
                placeholder="rashojban@gmail.com" 
                required 
                icon={<User size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="relative">
                <InputField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="•••••" 
                  required 
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-slate-500 pt-2 pb-4">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
                  <input type="checkbox" className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-sky-600 hover:underline">Forgot Password?</button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-500 text-sm font-medium animate-in slide-in-from-top-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full py-4 bg-sky-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-sky-800 transition-all duration-300 shadow-xl shadow-sky-900/10 flex items-center justify-center gap-2 group overflow-hidden relative ${isLoading ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>{isLoading ? 'Authenticating...' : 'Log In'}</span>
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to ExploreMate? <button onClick={() => onNavigate('signup')} className="font-bold text-sky-600 hover:underline">Create Account</button>
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Temporary Credentials</p>
              <div className="flex justify-center gap-4 text-xs font-mono text-slate-600">
                <span>User: rashojban@gmail.com</span>
                <span>Pass: 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Slideshow */}
        <div className="w-full md:w-[55%] relative bg-slate-900 overflow-hidden">
          {LOGIN_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms] ease-linear"
                style={{ transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.0)' }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            </div>
          ))}

          {/* Text Content Layer */}
          <div className="absolute bottom-0 left-0 w-full p-12 z-20">
            {LOGIN_SLIDES.map((slide, index) => (
               index === currentSlide && (
                <div key={slide.id} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-widest text-xs mb-3">
                    <MapPin size={14} /> {slide.location}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                    {slide.description}
                  </p>
                </div>
               )
            ))}
            
            {/* Slide Indicators */}
            <div className="flex gap-2 mt-8">
              {LOGIN_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;