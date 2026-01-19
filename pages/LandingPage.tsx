import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Globe, MapPin, Star, Heart, Compass, Zap, Coins, ArrowRightLeft, RefreshCw, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar, Footer } from '../components/Navigation';

gsap.registerPlugin(ScrollTrigger);

const DestinationCard = ({ image, title, location, rating, price, index }: any) => (
  <div className="destination-card group relative overflow-hidden rounded-[2.5rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-full border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
    <div className="relative h-72 overflow-hidden rounded-[2.5rem]">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <button className="absolute top-4 right-4 p-3 bg-white/30 backdrop-blur-md rounded-full hover:bg-white text-white hover:text-red-500 transition-colors">
        <Heart size={20} className={index === 1 ? "fill-red-500 text-red-500" : ""} />
      </button>
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
        <Star size={12} className="text-orange-400 fill-orange-400" /> {rating}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display">{title}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm font-medium mt-1">
            <MapPin size={14} /> {location}
          </div>
        </div>
        <div className="bg-sky-50 px-3 py-1 rounded-xl text-sky-700 font-bold text-sm">
          ${price}
        </div>
      </div>
    </div>
  </div>
);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('NPR');
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  ];

  const fetchRate = async () => {
    setLoading(true);
    try {
      // Using open.er-api.com for free real-time exchange rates
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();
      if (data && data.rates) {
        setRate(data.rates[toCurrency]);
        const date = new Date(data.time_last_update_utc);
        setLastUpdated(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      console.error("Failed to fetch rates", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const convertedAmount = rate && amount ? (parseFloat(amount) * rate).toFixed(2) : '---';

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
            <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
                   <Coins className="text-emerald-500" /> Currency Converter
                </h3>
                <p className="text-slate-500 text-sm mt-1">Live exchange rates for international travelers.</p>
            </div>
            {rate && (
                <div className="text-left sm:text-right bg-emerald-50 px-4 py-2 rounded-xl sm:bg-transparent sm:p-0">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Rate</div>
                     <div className="font-mono font-bold text-emerald-600">1 {fromCurrency} = {rate.toFixed(2)} {toCurrency}</div>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center relative z-10">
            {/* From */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Amount & Currency</label>
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent w-full p-2 text-xl font-bold text-slate-800 outline-none"
                        placeholder="100"
                        min="0"
                    />
                    <div className="w-px bg-slate-200 my-1 mx-2"></div>
                    <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer pr-2"
                    >
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code} {c.flag}</option>)}
                    </select>
                </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-6">
                <button 
                    onClick={handleSwap}
                    className="p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all hover:rotate-180 active:scale-90 shadow-sm"
                    title="Swap Currencies"
                >
                    <ArrowRightLeft size={20} />
                </button>
            </div>

            {/* To */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Converted To</label>
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <div className="w-full p-2 text-xl font-bold text-slate-800 flex items-center overflow-hidden">
                       {loading ? <span className="animate-pulse text-slate-400 text-base">Updating...</span> : convertedAmount}
                    </div>
                    <div className="w-px bg-slate-200 my-1 mx-2"></div>
                    <select 
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer pr-2"
                    >
                         {currencies.map(c => <option key={c.code} value={c.code}>{c.code} {c.flag}</option>)}
                    </select>
                </div>
            </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
             <div className="flex items-center gap-1">
                <TrendingUp size={14} /> Exchange rates updated in real-time.
             </div>
             <div className="flex items-center gap-1">
                 <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Last Update: {lastUpdated || 'Just now'}
             </div>
        </div>
    </div>
  );
};

// Expanded Destinations List
const ALL_DESTINATIONS = [
  {
    title: "Everest Base Camp",
    location: "Solukhumbu, Nepal",
    rating: "4.9",
    price: "1,400",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Phewa Lake Serenity",
    location: "Pokhara, Nepal",
    rating: "4.8",
    price: "600",
    image: "https://images.unsplash.com/photo-1546853899-709e50423661?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Bhaktapur Durbar Square",
    location: "Bhaktapur, Nepal",
    rating: "4.9",
    price: "50",
    image: "https://images.unsplash.com/photo-1596525712437-080c950294da?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Chitwan National Park",
    location: "Chitwan, Nepal",
    rating: "4.7",
    price: "300",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Annapurna Circuit",
    location: "Manang/Mustang, Nepal",
    rating: "4.9",
    price: "900",
    image: "https://images.unsplash.com/photo-1590606086785-304e225439cb?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Lumbini Sacred Garden",
    location: "Rupandehi, Nepal",
    rating: "4.8",
    price: "100",
    image: "https://images.unsplash.com/photo-1570702172793-27b32c21943d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Nagarkot Sunrise",
    location: "Bhaktapur, Nepal",
    rating: "4.6",
    price: "150",
    image: "https://images.unsplash.com/photo-1625763073739-c8eb7b9c6775?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Rara Lake",
    location: "Mugu, Nepal",
    rating: "4.9",
    price: "750",
    image: "https://images.unsplash.com/photo-1626014902263-12a912e9bd0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Patan Durbar Square",
    location: "Lalitpur, Nepal",
    rating: "4.8",
    price: "40",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=800"
  }
];

const LandingPage = ({ onNavigate, isLoggedIn }: { onNavigate: (page: string) => void, isLoggedIn?: boolean }) => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const [showAllLocations, setShowAllLocations] = useState(false);
  
  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Hero Badge Pop
    tl.fromTo('.hero-badge', 
      { y: 20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // 2. Modern Text Reveal (Skew + Slide Up)
    tl.fromTo('.hero-title-char', 
      { y: 100, opacity: 0, skewY: 10, rotateZ: 5 },
      { 
        y: 0, 
        opacity: 1, 
        skewY: 0, 
        rotateZ: 0,
        stagger: 0.02, 
        duration: 1, 
        ease: 'power4.out' 
      },
      "-=0.2"
    );

    // 3. Description & Buttons Fade Up
    tl.fromTo('.hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      "-=0.6"
    )
    .fromTo('.hero-btn',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
      "-=0.6"
    );

    // 4. Cinematic Visual Entry
    // Container pops in
    tl.fromTo('.hero-visual-wrapper',
      { scale: 0.9, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      "-=0.8"
    )
    // Image inside zooms out (Scale 1.4 -> 1) for a cinematic reveal effect
    .fromTo('.hero-main-image',
      { scale: 1.4 },
      { scale: 1, duration: 2, ease: 'power2.out' },
      "<" // Starts at same time as wrapper animation
    )
    // Floating cards pop
    .fromTo('.hero-floating-card',
      { scale: 0.8, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'elastic.out(1, 0.75)' },
      "-=1.5"
    );

    // Scroll Triggers for other sections
    gsap.utils.toArray('.section-fade-up').forEach((elem: any) => {
      gsap.fromTo(elem,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: elem, start: 'top 85%' }
        }
      );
    });

    gsap.fromTo('.destination-card',
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.destinations-grid', start: 'top 80%' }
      }
    );
    
    // Currency Converter Animation
    gsap.fromTo('.currency-section',
       { y: 60, opacity: 0 },
       {
           y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
           scrollTrigger: { trigger: '.currency-section', start: 'top 90%' }
       }
    );

  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-title-char inline-block whitespace-pre origin-bottom will-change-transform">
        {char}
      </span>
    ));
  };

  const visibleDestinations = showAllLocations ? ALL_DESTINATIONS : ALL_DESTINATIONS.slice(0, 3);

  return (
    <div className="w-full relative bg-slate-50/50">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div ref={heroRef} className="relative z-10">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 text-sky-600 font-bold text-xs uppercase tracking-wider shadow-sm mb-8">
              <Sparkles size={14} className="fill-sky-600" /> AI-Powered Travel
            </div>
            
            <h1 ref={textRef} className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 leading-[1.1] overflow-hidden">
              {splitText("Explore Nepal\nwith Intelligence")}
            </h1>
            
            <p className="hero-desc text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
              Experience personalized itineraries for the Himalayas, real-time trekking guidance, and seamless planning powered by next-gen AI.
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'signup')}
                className="hero-btn px-8 py-4 bg-sky-900 text-white rounded-2xl font-bold hover:bg-sky-800 transition-all shadow-lg shadow-sky-900/20 flex items-center gap-2 group"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Your Journey'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('features')}
                className="hero-btn px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm"
              >
                How it Works
              </button>
            </div>
          </div>

          <div className="hero-visual relative lg:h-[600px] flex items-center justify-center">
             {/* Abstract blobs */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200 to-purple-200 rounded-full blur-[80px] opacity-60 animate-pulse"></div>
             
             {/* Main Image Composition */}
             <div className="relative z-10 w-full max-w-md">
                <div className="hero-visual-wrapper relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
                   {/* Main Image with Zoom Effect - Showing Swayambhunath/Kathmandu vibes */}
                   <img 
                    src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800" 
                    alt="Nepal Hero" 
                    className="hero-main-image w-full h-[500px] object-cover will-change-transform" 
                   />
                   
                   {/* Floating Cards */}
                   <div className="hero-floating-card absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-[200px] animate-float">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Compass size={18} /></div>
                         <div className="text-xs font-bold text-slate-500">AI Recommendation</div>
                      </div>
                      <p className="text-slate-800 font-bold text-sm leading-tight">Visit Swayambhunath early to avoid crowds.</p>
                   </div>

                   <div className="hero-floating-card absolute top-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-slate-800">Traffic: Thamel</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Currency Converter Section */}
      <section className="currency-section py-8 relative px-4 md:px-8 -mt-8 md:-mt-16 z-20">
         <div className="max-w-4xl mx-auto">
            <CurrencyConverter />
         </div>
      </section>

      {/* Destinations Section */}
      <section className="py-24 bg-white relative z-10">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 section-fade-up">
               <div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Trending in Nepal</h2>
                  <p className="text-slate-500 text-lg max-w-md">Curated by AI based on current weather, festivals, and traveler reviews.</p>
               </div>
               <button 
                  onClick={() => setShowAllLocations(!showAllLocations)}
                  className="text-sky-600 font-bold hover:text-sky-700 flex items-center gap-2 group transition-all"
               >
                  {showAllLocations ? "Show Less" : "View All Locations"} 
                  {showAllLocations ? <ChevronUp size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
               </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 destinations-grid">
               {visibleDestinations.map((dest, i) => (
                  <DestinationCard key={i} {...dest} index={i} />
               ))}
            </div>
            
            {showAllLocations && (
               <div className="mt-12 text-center">
                  <button 
                    onClick={() => setShowAllLocations(false)} 
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
                  >
                     Show Less <ChevronUp size={16} />
                  </button>
               </div>
            )}
         </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center section-fade-up">
               <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sky-300 font-bold text-xs uppercase tracking-wider border border-white/10 mb-8">
                     <Zap size={14} /> The Future of Travel
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
                     Your Personal AI Travel Assistant
                  </h2>
                  <p className="text-slate-300 text-lg mb-12 leading-relaxed">
                     From real-time translation of Nepali to dynamic itinerary adjustments based on mountain weather, ExploreMate handles the logistics.
                  </p>
                  <button 
                     onClick={() => onNavigate('features')}
                     className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-sky-50 transition-colors shadow-lg"
                  >
                     Explore All Features
                  </button>
               </div>
               
               {/* Decorative Background */}
               <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-600/30 rounded-full blur-[100px]"></div>
                  <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"></div>
               </div>
            </div>
         </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;