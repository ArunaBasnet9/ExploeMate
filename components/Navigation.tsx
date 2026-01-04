import React, { useState, useEffect } from 'react';
import { Plane, Twitter, Globe, Menu, X } from 'lucide-react';

export const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <footer className="bg-white pt-24 pb-12 border-t border-slate-100 relative z-10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-sky-600 p-1.5 rounded-lg text-white">
              <Plane size={18} className="-rotate-45" />
            </div>
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
          { title: "Company", links: [{label: "About Us", page: "about"}, {label: "Features", page: "features"}, {label: "Blog", page: "blog"}] },
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

export const Navbar = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="bg-sky-600 p-2 rounded-lg text-white">
            <Plane size={20} className="-rotate-45" />
          </div>
          <span className="font-display font-bold text-xl text-sky-900 tracking-tight">ExploreMate</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate('about')} className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">About</button>
          <button onClick={() => onNavigate('landing')} className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Destinations</button>
          <button onClick={() => onNavigate('features')} className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Features</button>
          <button onClick={() => onNavigate('blog')} className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">Blog</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors">
            Log In
          </button>
          <button onClick={() => onNavigate('signup')} className="px-5 py-2.5 bg-sky-900 text-white rounded-full text-sm font-bold hover:bg-sky-800 transition-colors shadow-lg shadow-sky-900/20">
            Sign Up
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-2">
          <button onClick={() => { onNavigate('about'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">About</button>
          <button onClick={() => { onNavigate('landing'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">Destinations</button>
          <button onClick={() => { onNavigate('features'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">Features</button>
          <button onClick={() => { onNavigate('blog'); setIsOpen(false); }} className="text-left text-sm font-semibold text-slate-600 py-2">Blog</button>
          <hr className="border-slate-100" />
          <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="w-full py-3 text-center font-bold text-slate-700 bg-slate-50 rounded-xl">
            Log In
          </button>
          <button onClick={() => { onNavigate('signup'); setIsOpen(false); }} className="w-full py-3 text-center font-bold text-white bg-sky-900 rounded-xl">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};