import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, User, Eye, EyeOff, ShieldCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { InputField, Logo } from '../components/SharedUI';
import { LOGIN_IMAGES } from '../assets/images';

const LOGIN_SLIDES = [
  {
    id: 1,
    image: LOGIN_IMAGES.POKHARA,
    title: "Phewa Lake Serenity",
    location: "Pokhara, Nepal",
    description: "Start your journey where the mountains touch the water. Experience the tranquility of the Himalayas."
  },
  {
    id: 2,
    image: LOGIN_IMAGES.EVEREST,
    title: "AI Itinerary Engine",
    location: "Solukhumbu, Nepal",
    description: "Our neural engine synchronizes mountain weather and local data to plan your perfect Himalayan trek."
  },
  {
    id: 3,
    image: LOGIN_IMAGES.BOUDHANATH,
    title: "Heritage Sync",
    location: "Kathmandu Valley",
    description: "Access encrypted cultural data and historic records through our real-time heritage synchronization system."
  }
];

// Preserves spacing perfectly using &nbsp; and whitespace-pre
const DecodingText = ({ text, className }: { text: string, className?: string }) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    
    const chars = text.split('');
    el.innerHTML = chars.map(char => 
      `<span class="char inline-block whitespace-pre" style="opacity:0;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    const charElements = el.querySelectorAll('.char');
    const scrambleSet = "X@#%&0123456789ABCDEF";
    
    const tl = gsap.timeline();
    tl.to(charElements, {
        duration: 1,
        opacity: 1,
        stagger: 0.04,
        ease: "power4.out",
        onUpdate: function() {
            const progress = this.progress();
            charElements.forEach((charEl, i) => {
                if (progress < (i / chars.length)) {
                   if (chars[i] !== ' ') {
                       charEl.textContent = scrambleSet[Math.floor(Math.random() * scrambleSet.length)];
                   }
                } else {
                   charEl.innerHTML = chars[i] === ' ' ? '&nbsp;' : chars[i];
                }
            });
        }
    });
    return () => { tl.kill(); };
  }, [text]);

  return <h1 ref={elementRef} className={className} aria-label={text}></h1>;
};

const LoginPage = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOGIN_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo('.login-card', 
      { opacity: 0, y: 50, scale: 0.98 }, 
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out" }
    );
    gsap.fromTo('.form-item',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out", delay: 0.4 }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Security credentials required.');
        gsap.to(formRef.current, { x: -6, duration: 0.1, repeat: 5, yoyo: true });
        return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 bg-slate-50 overflow-hidden font-sans relative">
      <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-sky-100 rounded-full blur-[100px] md:blur-[120px] opacity-60"></div>
      
      <div className="login-card w-full max-w-[1100px] bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">
        
        <div className="w-full md:w-[45%] p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8 md:mb-10">
            <div className="form-item inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-4 md:mb-6 border border-sky-100">
              <ShieldCheck size={12} /> Encrypted Access
            </div>
            
            <DecodingText 
              text="Welcome to ExploreMate" 
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4 leading-tight tracking-tight" 
            />
            
            <p className="form-item text-slate-500 font-medium text-sm md:text-base max-w-sm md:max-w-none">
              Authorized personnel only. Sign in to synchronize your global travel profile and AI preferences.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="form-item">
              <InputField 
                label="Identity Email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<User size={18} />}
                required 
              />
            </div>
            
            <div className="form-item">
              <InputField 
                label="Security Key" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required 
              />
            </div>

            {error && (
              <div className="form-item p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold animate-in fade-in">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className="form-item w-full h-16 bg-slate-900 text-white rounded-2xl font-bold tracking-wide hover:bg-slate-800 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group relative overflow-hidden active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-lg">Initiate Login</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="form-item mt-8 md:mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
            <p className="text-slate-400 text-xs sm:text-sm">New traveler?</p>
            <button onClick={() => onNavigate('signup')} className="text-sky-600 font-bold text-xs sm:text-sm hover:underline">Register Profile</button>
          </div>
        </div>

        {/* Cinematic Visual Side - Hidden on small mobile to prioritize form */}
        <div className="hidden md:block w-[55%] relative bg-slate-900 overflow-hidden">
          {LOGIN_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover brightness-75 scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-10 lg:p-14 z-20">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                  <MapPin size={12} /> {slide.location}
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">{slide.title}</h2>
                <p className="text-slate-300 text-base lg:text-lg max-w-md">{slide.description}</p>
                
                <div className="flex flex-wrap gap-3 mt-8">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                      <Sparkles size={12} /> AI Assisted
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                      <ShieldCheck size={12} /> Safe Protocol
                   </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-6 right-10 flex items-center gap-2 opacity-30 group select-none">
             <Logo className="w-5 h-5 grayscale invert group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">ExploreMate Console</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;