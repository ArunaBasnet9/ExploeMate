import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, User, Mail, MapPin } from 'lucide-react';
import { InputField } from '../components/SharedUI';
import { SIGNUP_IMAGES } from '../assets/images';

// Nepal Specific Slides for Signup
const SIGNUP_SLIDES = [
  {
    id: 1,
    image: SIGNUP_IMAGES.ANNAPURNA,
    title: "Adventure Awaits",
    location: "Annapurna Circuit",
    description: "Start your journey on the world's most beautiful trails."
  },
  {
    id: 2,
    image: SIGNUP_IMAGES.BHAKTAPUR,
    title: "Timeless Heritage",
    location: "Bhaktapur Durbar Square",
    description: "Walk through living history in ancient royal cities."
  },
  {
    id: 3,
    image: SIGNUP_IMAGES.CHITWAN,
    title: "Into the Wild",
    location: "Chitwan National Park",
    description: "Encounter rare wildlife in the lush Terai jungles."
  }
];

const SignupPage = ({ onSignup, onNavigate }: { onSignup: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SIGNUP_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  // Initial Animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 40, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    if (formRef.current) {
      tl.fromTo(formRef.current.children,
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.6"
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
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
        
        {/* Left Side - Visual (Mirrored from Login for variety) */}
        <div className="w-full md:w-[50%] relative bg-slate-900 overflow-hidden order-last md:order-first">
          {SIGNUP_SLIDES.map((slide, index) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-sunset-900/90 via-sunset-900/30 to-transparent"></div>
            </div>
          ))}

          <div className="absolute bottom-0 left-0 w-full p-12 z-20">
            {SIGNUP_SLIDES.map((slide, index) => (
               index === currentSlide && (
                <div key={slide.id} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex items-center gap-2 text-orange-200 font-bold uppercase tracking-widest text-xs mb-3">
                    <MapPin size={14} /> {slide.location}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-orange-50 text-lg max-w-md leading-relaxed opacity-90">
                    {slide.description}
                  </p>
                </div>
               )
            ))}
            
            <div className="flex gap-2 mt-8">
              {SIGNUP_SLIDES.map((_, i) => (
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

        {/* Right Side - Form */}
        <div className="w-full md:w-[50%] p-8 md:p-12 flex flex-col justify-center relative bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[4rem] -z-0"></div>
            
            <div className="max-w-sm mx-auto w-full relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs uppercase tracking-wider mb-6 border border-orange-100">
                <User size={14} /> Join Us
              </div>
              <h1 className="text-4xl font-grotesk font-bold text-slate-900 mb-3">
                Create Account
              </h1>
              <p className="text-slate-500 font-medium">Join thousands of travelers exploring Nepal.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <InputField 
                  label="Full Name" 
                  type="text" 
                  placeholder="Tenzing Norgay" 
                  required 
                  icon={<User size={18} className="text-slate-400" />} 
              />
              <InputField 
                  label="Email" 
                  type="email" 
                  placeholder="explorer@himalayas.com" 
                  required 
                  icon={<Mail size={18} className="text-slate-400" />} 
              />
              <div className="relative">
                <InputField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>

              <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                    <span>{isLoading ? 'Creating Account...' : 'Sign Up Free'}</span>
                    {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Already have an account? <button onClick={() => onNavigate('login')} className="font-bold text-sky-600 hover:underline">Log in</button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;