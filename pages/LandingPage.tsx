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

    // Hero Animations
    tl.fromTo('.hero-badge', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.hero-title-char', 
      { y: 50, opacity: 0, rotateX: -90 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.02, duration: 0.8, ease: 'back.out(1.2)' },
      "-=0.4"
    )
    .fromTo('.hero-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      },
      "-=0.6"
    )
    .fromTo('.hero-btn',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
      "-=0.6"
    )
    .fromTo('.hero-visual',
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      "-=0.8"
    );

    // Scroll Triggers
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
      <span key={index} className="hero-title-char inline-block whitespace-pre">
        {char}
      </span>
    ));
  };

  const popularDestinations = [
    {
      title: "Kyoto Ancient Temples",
      location: "Kyoto, Japan",
      rating: "4.9",
      price: "1,200",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Santorini Sunset",
      location: "Santorini, Greece",
      rating: "4.8",
      price: "2,400",
      image: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Machu Picchu Trek",
      location: "Cusco, Peru",
      rating: "4.9",
      price: "1,800",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800"
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
            
            <h1 ref={textRef} className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-6 leading-[1.1]">
              {splitText("Explore the World\nwith Intelligence")}
            </h1>
            
            <p className="hero-desc text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
              Experience personalized itineraries, real-time guidance, and seamless planning powered by next-gen AI.
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
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                   <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" alt="Hero" className="w-full h-[500px] object-cover" />
                   
                   {/* Floating Cards */}
                   <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-[200px] animate-float">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Compass size={18} /></div>
                         <div className="text-xs font-bold text-slate-500">AI Recommendation</div>
                      </div>
                      <p className="text-slate-800 font-bold text-sm leading-tight">Visit Hallstatt early to avoid crowds.</p>
                   </div>

                   <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-slate-800">Live Traffic Update</span>
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
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Trending Destinations</h2>
                  <p className="text-slate-500 text-lg max-w-md">Curated by AI based on current weather, events, and popularity.</p>
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
                     From real-time translation to dynamic itinerary adjustments based on weather, ExploreMate handles the logistics so you can focus on the experience.
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