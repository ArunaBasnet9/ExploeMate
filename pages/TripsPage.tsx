import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Calendar, MapPin, Clock, MoreVertical, Plus, Users, ArrowRight, Plane, CheckCircle2, AlertCircle, Compass, Mountain, User, Bell } from 'lucide-react';

const TRIPS = [
  {
    id: 1,
    status: 'upcoming',
    title: 'Amalfi Coast Summer',
    location: 'Positano, Italy',
    startDate: '2024-07-15',
    endDate: '2024-07-22',
    image: 'https://images.unsplash.com/photo-1533904350293-3da112575914?auto=format&fit=crop&q=80&w=800',
    collaborators: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=5'],
    daysLeft: 14
  },
  {
    id: 2,
    status: 'draft',
    title: 'Kyoto Fall Colors',
    location: 'Kyoto, Japan',
    startDate: 'TBD',
    endDate: 'TBD',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    collaborators: [],
    daysLeft: null
  },
  {
    id: 3,
    status: 'past',
    title: 'Swiss Alps Hiking',
    location: 'Interlaken, Switzerland',
    startDate: '2023-09-10',
    endDate: '2023-09-18',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800',
    collaborators: ['https://i.pravatar.cc/150?img=3'],
    daysLeft: -200
  },
  {
    id: 4,
    status: 'upcoming',
    title: 'New York City Weekend',
    location: 'New York, USA',
    startDate: '2024-11-20',
    endDate: '2024-11-24',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&q=80&w=800',
    collaborators: ['https://i.pravatar.cc/150?img=8', 'https://i.pravatar.cc/150?img=9', 'https://i.pravatar.cc/150?img=10'],
    daysLeft: 142
  }
];

const TripCard = ({ trip }: { trip: typeof TRIPS[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onHover = (enter: boolean) => {
    if (enter) {
        gsap.to(cardRef.current, { y: -8, scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', duration: 0.4 });
        gsap.to(cardRef.current?.querySelector('.trip-img'), { scale: 1.1, duration: 0.6 });
        gsap.to(cardRef.current?.querySelector('.trip-action'), { x: 0, opacity: 1, duration: 0.3 });
    } else {
        gsap.to(cardRef.current, { y: 0, scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', duration: 0.4 });
        gsap.to(cardRef.current?.querySelector('.trip-img'), { scale: 1, duration: 0.6 });
        gsap.to(cardRef.current?.querySelector('.trip-action'), { x: -10, opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div 
        ref={cardRef}
        className="group bg-white rounded-[2.5rem] p-3 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:border-sky-100 transition-colors cursor-pointer overflow-hidden trip-card-anim"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
    >
        {/* Image Section */}
        <div className="w-full md:w-72 h-56 md:h-auto rounded-[2rem] overflow-hidden relative shrink-0">
            <img src={trip.image} alt={trip.title} className="trip-img w-full h-full object-cover transition-transform duration-700" />
            <div className="absolute top-4 left-4">
                {trip.status === 'upcoming' && (
                    <div className="bg-sky-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Clock size={12} /> {trip.daysLeft} days to go
                    </div>
                )}
                {trip.status === 'draft' && (
                    <div className="bg-slate-800/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <AlertCircle size={12} /> Draft
                    </div>
                )}
                {trip.status === 'past' && (
                    <div className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 size={12} /> Completed
                    </div>
                )}
            </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow py-3 pr-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                    <MapPin size={16} className="text-sky-500" /> {trip.location}
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-3 group-hover:text-sky-700 transition-colors">
                {trip.title}
            </h3>

            <div className="flex items-center gap-4 text-slate-600 text-sm font-medium mb-6">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{trip.startDate} — {trip.endDate}</span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                    {trip.collaborators.length > 0 ? (
                        <>
                            {trip.collaborators.map((img, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white relative z-0 hover:z-10 hover:scale-110 transition-transform">
                                    <img src={img} alt="User" className="w-full h-full rounded-full object-cover" />
                                </div>
                            ))}
                            <button className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-xs font-bold z-0 ml-2">
                                <Plus size={12} />
                            </button>
                        </>
                    ) : (
                        <div className="text-slate-400 text-sm flex items-center gap-2">
                            <Users size={16} /> <span className="text-xs">Solo Trip</span>
                        </div>
                    )}
                </div>

                <div className="trip-action flex items-center gap-2 text-sky-600 font-bold text-sm opacity-0 -translate-x-4 transition-all duration-300">
                    {trip.status === 'draft' ? 'Continue Planning' : 'View Itinerary'} <ArrowRight size={18} />
                </div>
            </div>
        </div>
    </div>
  );
};

const TripsPage = ({ onLogout, onNavigate, isLoggedIn }: { onLogout: () => void, onNavigate: (page: string) => void, isLoggedIn?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'draft'>('upcoming');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTrips = TRIPS.filter(trip => {
      if (activeTab === 'upcoming') return trip.status === 'upcoming';
      if (activeTab === 'past') return trip.status === 'past';
      return trip.status === 'draft';
  });

  useEffect(() => {
    // Header & Mobile Nav Animations
    const tl = gsap.timeline();
    tl.fromTo('.dash-header', 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    tl.fromTo('.trips-header-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
    tl.fromTo('.dash-nav-mobile',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
    );
  }, []);

  useEffect(() => {
      // List Animation on Tab Change
      if (containerRef.current) {
        gsap.fromTo(containerRef.current.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
        );
      }
  }, [activeTab]);

  const navItems = [
    { label: 'Explore', icon: Compass, page: 'dashboard' },
    { label: 'Saved', icon: Mountain, page: 'saved' },
    { label: 'Trips', icon: Calendar, page: 'trips' },
    { label: 'Profile', icon: User, page: 'dashboard' }
  ];

  return (
    <div className="relative w-full min-h-screen p-4 pb-24 md:p-8 flex flex-col items-center bg-slate-50/50">
      
      {/* Dashboard Header */}
      <div className="dash-header w-full max-w-6xl flex items-center justify-between mb-8 z-20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="bg-sky-600 p-2 rounded-lg text-white shadow-lg shadow-sky-600/20 group-hover:scale-110 transition-transform duration-300">
            <Plane size={24} className="-rotate-45" />
          </div>
          <span className="font-display font-bold text-xl text-sky-900 tracking-tight group-hover:text-sky-600 transition-colors">ExploreMate</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl px-2 py-2 rounded-full border border-white/50 shadow-sm ring-1 ring-slate-100">
          {navItems.map((item, i) => (
             <button 
                key={item.label} 
                onClick={() => onNavigate(item.page)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    item.page === 'trips' 
                    ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                    : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                }`}
             >
                <item.icon size={16} className={item.page === 'trips' ? 'fill-white' : ''} />
                {item.label}
             </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full bg-white hover:bg-sky-50 transition-colors text-slate-600 hover:text-sky-600 relative border border-slate-100 shadow-sm hover:shadow-md">
            <Bell size={20} />
          </button>
          <button onClick={onLogout} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors hidden sm:block">
            Log Out
          </button>
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 p-[2px] shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
             <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full rounded-full border-2 border-white object-cover" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-5xl z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <div className="trips-header-anim inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider shadow-sm mb-4">
                    <Plane size={14} className="text-sky-500" /> Travel Log
                </div>
                <h1 className="trips-header-anim text-4xl md:text-6xl font-display font-bold text-slate-900 mb-2 tracking-tight">
                    My Adventures
                </h1>
                <p className="trips-header-anim text-slate-500 text-lg">
                    Manage your itineraries and look back on past journeys.
                </p>
            </div>
            
            <button className="trips-header-anim px-6 py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 hover:scale-105 active:scale-95 duration-200 flex items-center gap-2">
                <Plus size={20} /> Create New Trip
            </button>
        </div>

        {/* Tabs */}
        <div className="trips-header-anim border-b border-slate-200 mb-8 flex gap-8">
            {['upcoming', 'draft', 'past'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                        activeTab === tab 
                        ? 'text-sky-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {tab} Trips
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-t-full"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Trips List */}
        <div ref={containerRef} className="space-y-6 min-h-[400px]">
            {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Plane size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} trips found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-8">Ready to explore somewhere new? Start planning your next adventure today.</p>
                    <button className="text-sky-600 font-bold hover:underline">Plan a trip now</button>
                </div>
            )}
        </div>

      </div>
      
      {/* Bottom Nav (Mobile Only) */}
      <div className="dash-nav-mobile md:hidden fixed bottom-4 left-4 right-4 bg-gradient-to-tr from-sky-600 via-blue-600 to-sky-700 backdrop-blur-xl border border-white/20 py-4 px-8 rounded-2xl shadow-xl shadow-sky-900/20 z-50 flex items-center justify-between ring-1 ring-white/20">
        {navItems.map((item, i) => {
           const isActive = item.page === 'trips';
           return (
            <button 
                key={item.label} 
                onClick={() => onNavigate(item.page)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative p-2 rounded-xl ${isActive ? 'text-white scale-110' : 'text-sky-200 hover:text-white hover:bg-white/10'}`}
            >
                <item.icon size={24} className={`transition-all duration-300 ${isActive ? 'fill-white drop-shadow-md' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <span className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>}
            </button>
           );
        })}
      </div>
    </div>
  );
};

export default TripsPage;