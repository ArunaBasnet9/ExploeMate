import React, { useState, useEffect } from 'react';
import { Twitter, Globe, Menu, X, Smartphone } from 'lucide-react';
import { Logo } from './SharedUI';

export const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <footer className="bg-white pt-24 pb-12 border-t border-slate-100 relative z-10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo className="w-8 h-8" />
            <span className="font-display font-bold text-xl text-sky-900">ExploreMate</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your intelligent travel companion for personalized itineraries, seamless navigation, and authentic experiences.
          </p>
          <div className="flex gap-4 text-slate-400">
            <Twitter size={20} className="hover:text-sky-500 cursor-pointer transition-colors" />
            <Globe size={20} className="hover:text-sky-500 cursor-pointer transition-colors" />
          </div>
        </div>
        
        {[
          { title: "Company", links: [{label: "About Us", page: "about"}, {label: "Features", page: "features"}, {label: "News & Weather", page: "news"}] },
          { title: "Features", links: [{label: "AI Planner", page: "features"}, {label: "Route Optimizer", page: "features"}] },
          { title: "Support", links: [{label: "Help Center", page: "faq"}, {label: "FAQ", page: "faq"}, {label: "Contact", page: "about"}] }
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-bold text-slate-900 mb-6">{col.title}</h4>
            <ul className="space-y-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <button 
                    onClick={() => link.page && onNavigate(link.page)}
                    className="text-slate-500 text-sm hover:text-sky-600 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        &copy; 2024 ExploreMate. All rights reserved.
      </div>
    </div>
  </footer>
);

export const Navbar = ({ onNavigate, isLoggedIn = false }: { onNavigate: (page: string) => void, isLoggedIn?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = scrolled ? 'text-sky-100 hover:text-white' : 'text-slate-600 hover:text-sky-600';
  const logoText = scrolled ? 'text-white' : 'text-sky-900';
  const logoBg = scrolled ? 'bg-white/10 backdrop-blur-md' : 'bg-transparent';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className={`${logoBg} p-1.5 rounded-xl shadow-sm transition-colors duration-300`}>
            <Logo className="w-8 h-8" variant={scrolled ? "white" : "default"} />
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${logoText}`}>ExploreMate</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('landing')} className={`text-sm font-semibold transition-colors ${textColor}`}>Home</button>
          <button onClick={() => onNavigate('about')} className={`text-sm font-semibold transition-colors ${textColor}`}>About</button>
          <button onClick={() => onNavigate('features')} className={`text-sm font-semibold transition-colors ${textColor}`}>Features</button>
          <button onClick={() => onNavigate('news')} className={`text-sm font-semibold transition-colors ${textColor}`}>News</button>
          <button className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColor}`}>
             <Smartphone size={16} /> Download App
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
             <button onClick={() => onNavigate('dashboard')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${scrolled ? 'bg-white text-sky-700 hover:bg-sky-50' : 'bg-sky-900 text-white hover:bg-sky-800'}`}>
               Dashboard
             </button>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className={`text-sm font-bold transition-colors ${scrolled ? 'text-white hover:text-sky-200' : 'text-slate-700 hover:text-sky-600'}`}>
                Log In
              </button>
              <button onClick={() => onNavigate('signup')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${scrolled ? 'bg-white text-sky-700 hover:bg-sky-50' : 'bg-sky-900 text-white hover:bg-sky-800'}`}>
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden ${scrolled ? 'text-white' : 'text-slate-700'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-2">
          <button onClick={() => { onNavigate('landing'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">Home</button>
          <button onClick={() => { onNavigate('about'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">About</button>
          <button onClick={() => { onNavigate('features'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">Features</button>
          <button onClick={() => { onNavigate('news'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">News & Weather</button>
          <button className="text-left text-sm font-semibold text-slate-600 py-2 flex items-center gap-2">
             <Smartphone size={16} /> Download App
          </button>
          <hr className="border-slate-100" />
          
          {isLoggedIn ? (
            <button onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="w-full py-3 text-center font-bold text-white bg-sky-900 rounded-xl">
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="w-full py-3 text-center font-bold text-slate-700 bg-slate-50 rounded-xl">
                Log In
              </button>
              <button onClick={() => { onNavigate('signup'); setIsOpen(false); }} className="w-full py-3 text-center font-bold text-white bg-sky-900 rounded-xl">
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};