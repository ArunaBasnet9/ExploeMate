import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ArrowLeft, Eye, EyeOff, User, Mail, Phone, MapPin, Mountain, Utensils, Camera, Tent, Landmark, Check, Globe, Calendar, Leaf, Bed, Users, Languages, HeartPulse, History } from 'lucide-react';
import { InputField } from '../components/SharedUI';
import { SIGNUP_IMAGES } from '../assets/images';

// Nepal Specific Slides
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

const INTERESTS = [
  { id: 'nature', label: 'Nature & Trek', icon: Mountain },
  { id: 'culture', label: 'Culture & History', icon: Landmark },
  { id: 'food', label: 'Food & Drink', icon: Utensils },
  { id: 'adventure', label: 'Adventure Sports', icon: Tent },
  { id: 'photo', label: 'Photography', icon: Camera },
];

const BUDGETS = [
  { id: 'budget', label: 'Backpacker ($)', desc: 'Hostels & Street Food' },
  { id: 'comfort', label: 'Standard ($$)', desc: 'Hotels & Restaurants' },
  { id: 'luxury', label: 'Luxury ($$$)', desc: 'Resorts & Fine Dining' },
];

const ACCOMMODATION = [
  { id: 'hotel', label: 'Hotel' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'homestay', label: 'Homestay' },
  { id: 'resort', label: 'Resort' },
];

const DIETARY = [
  { id: 'none', label: 'No Restrictions' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: 'Halal' },
  { id: 'gf', label: 'Gluten Free' },
];

const HEALTH_CONDITIONS = [
  { id: 'altitude', label: 'Altitude Sensitive' },
  { id: 'mobility', label: 'Mobility Issues' },
  { id: 'motion', label: 'Motion Sickness' },
  { id: 'asthma', label: 'Asthma/Breathing' },
];

const SPOKEN_LANGUAGES = ["English", "Spanish", "French", "Chinese", "Hindi", "German", "Japanese", "Korean", "Nepali"];
const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const SignupPage = ({ onSignup, onNavigate }: { onSignup: () => void, onNavigate: (page: string) => void }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nationality: 'Nepal',
    language: 'English',
    ageGroup: '25-34',
    gender: 'Prefer not to say',
    experience: 'first_timer', // first_timer, returning
    interests: [] as string[],
    budget: 'comfort',
    accommodation: 'hotel',
    dietary: 'none',
    healthConditions: [] as string[]
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
    animateStepEntry();
  }, []);

  const animateStepEntry = () => {
    if (formRef.current) {
      gsap.fromTo(formRef.current.children,
        { x: 20, opacity: 0 }, 
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) return;
    if (step === 2 && (!formData.nationality || !formData.phone)) return;
    
    // Animate exit
    if (formRef.current) {
        gsap.to(formRef.current.children, {
            x: -20, opacity: 0, duration: 0.3, stagger: 0.05, onComplete: () => {
                setStep(s => s + 1);
            }
        });
    }
  };

  const handleBack = () => {
    if (formRef.current) {
        gsap.to(formRef.current.children, {
            x: 20, opacity: 0, duration: 0.3, stagger: 0.05, onComplete: () => {
                setStep(s => s - 1);
            }
        });
    }
  };

  useEffect(() => {
    // Trigger entry animation whenever step changes
    const timer = setTimeout(() => animateStepEntry(), 50); // Small delay to allow DOM update
    return () => clearTimeout(timer);
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 2000);
  };

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const toggleHealth = (id: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(id) 
        ? prev.healthConditions.filter(h => h !== id)
        : [...prev.healthConditions, id]
    }));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10 bg-slate-50">
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm"
      >
        <ArrowLeft size={18} /> Back Home
      </button>

      <div ref={containerRef} className="bg-white w-full max-w-[1100px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* Left Side - Visual */}
        <div className="w-full md:w-[50%] relative bg-slate-900 overflow-hidden order-last md:order-first h-[300px] md:h-auto">
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
                onError={(e) => {
                    // Fallback
                    e.currentTarget.src = "https://images.unsplash.com/photo-1590606086785-304e225439cb?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </div>
          ))}

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
            {SIGNUP_SLIDES.map((slide, index) => (
               index === currentSlide && (
                <div key={slide.id} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-widest text-xs mb-3">
                    <MapPin size={14} /> {slide.location}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-200 text-base md:text-lg max-w-md leading-relaxed opacity-90 hidden md:block">
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

        {/* Right Side - Multi-step Form */}
        <div className="w-full md:w-[50%] p-8 md:p-12 flex flex-col justify-center relative bg-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[4rem] z-0"></div>
            
            <div className="max-w-md mx-auto w-full relative z-10">
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                            i <= step ? 'w-8 bg-sky-600' : 'w-4 bg-slate-200'
                        }`}></div>
                    ))}
                    <span className="ml-auto text-xs font-bold text-slate-400">Step {step} of 3</span>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-grotesk font-bold text-slate-900 mb-2">
                        {step === 1 && "Create Account"}
                        {step === 2 && "Personal Details"}
                        {step === 3 && "Travel DNA"}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        {step === 1 && "Start your adventure with ExploreMate."}
                        {step === 2 && "Tell us a bit about yourself."}
                        {step === 3 && "Help our AI curate the best spots for you."}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div ref={formRef} className="min-h-[320px]">
                        {/* STEP 1: ACCOUNT */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <InputField 
                                    label="Full Name" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Tenzing Norgay" 
                                    required 
                                    icon={<User size={18} className="text-slate-400" />} 
                                />
                                <InputField 
                                    label="Email Address" 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="explorer@himalayas.com" 
                                    required 
                                    icon={<Mail size={18} className="text-slate-400" />} 
                                />
                                <div className="relative">
                                    <InputField 
                                    label="Password" 
                                    type={showPassword ? "text" : "password"} 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Min 8 characters" 
                                    required 
                                    icon={
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    }
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: PERSONAL */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nationality</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.nationality}
                                                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                                                className="w-full px-4 py-4 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                                            >
                                                <option value="Nepal">Nepal</option>
                                                <option value="India">India</option>
                                                <option value="China">China</option>
                                                <option value="USA">USA</option>
                                                <option value="UK">UK</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Age Group</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.ageGroup}
                                                onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                                                className="w-full px-4 py-4 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                                            >
                                                {AGE_RANGES.map(age => (
                                                    <option key={age} value={age}>{age}</option>
                                                ))}
                                            </select>
                                            <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gender</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.gender}
                                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                                className="w-full px-4 py-4 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                                            >
                                                {GENDERS.map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                            <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Preferred Language</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.language}
                                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                                                className="w-full px-4 py-4 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer"
                                            >
                                                {SPOKEN_LANGUAGES.map(l => (
                                                    <option key={l} value={l}>{l}</option>
                                                ))}
                                            </select>
                                            <Languages size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <InputField 
                                            label="Mobile Number" 
                                            type="tel" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+977 9800000000" 
                                            icon={<Phone size={18} className="text-slate-400" />} 
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Used for emergency alerts and booking confirmations.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PREFERENCES */}
                        {step === 3 && (
                            <div className="space-y-6">
                                {/* Experience Toggle */}
                                <div className="bg-slate-50 p-1.5 rounded-xl flex">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, experience: 'first_timer'})}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.experience === 'first_timer' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        First Time Visitor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, experience: 'returning'})}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.experience === 'returning' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Returning Visitor
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest.id}
                                                type="button"
                                                onClick={() => toggleInterest(interest.id)}
                                                className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                    formData.interests.includes(interest.id) 
                                                    ? 'bg-sky-50 border-sky-500 text-sky-700' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300'
                                                }`}
                                            >
                                                <interest.icon size={14} />
                                                {interest.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Travel Style</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {BUDGETS.map((b) => (
                                            <div 
                                                key={b.id}
                                                onClick={() => setFormData({...formData, budget: b.id})}
                                                className={`p-2 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                                                    formData.budget === b.id 
                                                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' 
                                                    : 'bg-white border-slate-200 hover:border-emerald-300'
                                                }`}
                                            >
                                                <span className={`text-xs font-bold ${formData.budget === b.id ? 'text-emerald-800' : 'text-slate-700'}`}>{b.label.split(' ')[0]}</span>
                                                <span className="text-[10px] text-slate-400">{b.label.split(' ')[1]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Accommodation</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.accommodation}
                                                onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                                                className="w-full px-4 py-3 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer text-sm"
                                            >
                                                {ACCOMMODATION.map(acc => (
                                                    <option key={acc.id} value={acc.id}>{acc.label}</option>
                                                ))}
                                            </select>
                                            <Bed size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dietary</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.dietary}
                                                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                                                className="w-full px-4 py-3 bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer text-sm"
                                            >
                                                {DIETARY.map(d => (
                                                    <option key={d.id} value={d.id}>{d.label}</option>
                                                ))}
                                            </select>
                                            <Leaf size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Health Conditions */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Health & Accessibility</label>
                                    <div className="flex flex-wrap gap-2">
                                        {HEALTH_CONDITIONS.map((cond) => (
                                            <button
                                                key={cond.id}
                                                type="button"
                                                onClick={() => toggleHealth(cond.id)}
                                                className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                                    formData.healthConditions.includes(cond.id) 
                                                    ? 'bg-red-50 border-red-500 text-red-700' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'
                                                }`}
                                            >
                                                <HeartPulse size={14} className={formData.healthConditions.includes(cond.id) ? 'text-red-500' : 'text-slate-400'} />
                                                {cond.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1"><History size={10}/> Helps AI warn about high altitude or steep treks.</p>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                    <input type="checkbox" required className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500" />
                                    <p className="text-xs text-slate-500">I agree to <a href="#" className="text-sky-600 underline">Terms</a> & <a href="#" className="text-sky-600 underline">Privacy Policy</a>.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-6 mt-2 flex gap-4">
                        {step > 1 && (
                            <button 
                                type="button"
                                onClick={handleBack}
                                className="px-6 h-16 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                Back
                            </button>
                        )}
                        
                        <button 
                            type={step === 3 ? "submit" : "button"}
                            onClick={step === 3 ? undefined : handleNext}
                            disabled={isLoading}
                            className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
                        >
                            <span className="text-lg">{step === 3 ? (isLoading ? 'Creating Account...' : 'Complete Signup') : 'Continue'}</span>
                            {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>
                
                {step === 1 && (
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm font-medium">
                            Already have an account? <button onClick={() => onNavigate('login')} className="font-bold text-sky-600 hover:underline">Log in</button>
                        </p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;