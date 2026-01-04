import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Globe, MapPin, Star, Heart, Compass, Zap } from 'lucide-react';
import { Navbar, Footer } from '../components/Navigation';

gsap.registerPlugin(ScrollTrigger);

const DestinationCard = ({ image, title, location, rating, price, index }: any) => (
  <div className="destination-card group relative overflow-hidden rounded-[2.5rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-full border border-slate-100">
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

const LandingPage = ({ onNavigate, isLoggedIn }: { onNavigate: (page: string) => void, isLoggedIn?: boolean }) => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  
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

  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-title-char inline-block whitespace-pre origin-bottom will-change-transform">
        {char}
      </span>
    ));
  };

  const popularDestinations = [
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
    }
  ];

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

      {/* Destinations Section */}
      <section className="py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 section-fade-up">
               <div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Trending in Nepal</h2>
                  <p className="text-slate-500 text-lg max-w-md">Curated by AI based on current weather, festivals, and traveler reviews.</p>
               </div>
               <button className="text-sky-600 font-bold hover:text-sky-700 flex items-center gap-2 group">
                  View All Locations <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 destinations-grid">
               {popularDestinations.map((dest, i) => (
                  <DestinationCard key={i} {...dest} index={i} />
               ))}
            </div>
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