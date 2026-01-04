import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { MapPin, Languages, QrCode, Users, Plane, Bell, Sun, Compass, ArrowRight, Sparkles, Search, Mountain, Calendar } from 'lucide-react';

const DashboardPage = ({ onLogout }: { onLogout: () => void }) => {
  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Header
    tl.fromTo('.dash-header', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // 2. Welcome Card (Main Feature)
    tl.fromTo('.dash-welcome',
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' },
        "-=0.6"
    );

    // 3. Search Bar
    tl.fromTo('.dash-search',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        "-=0.5"
    );

    // 4. Tools Grid (Staggered)
    tl.fromTo('.dash-tool',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.5)' },
        "-=0.4"
    );

    // 5. Recommendations List (Staggered)
    tl.fromTo('.dash-rec',
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
        "-=0.4"
    );

    // 6. Bottom Nav
    tl.fromTo('.dash-nav',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        "-=0.6"
    );

  }, []);

  const tools = [
    { icon: <MapPin className="text-white" size={20} />, label: "Route Optimizer", color: "bg-emerald-500" },
    { icon: <Languages className="text-white" size={20} />, label: "Translator", color: "bg-blue-500" },
    { icon: <QrCode className="text-white" size={20} />, label: "QR Guide", color: "bg-purple-500" },
    { icon: <Users className="text-white" size={20} />, label: "Group Plan", color: "bg-orange-500" },
  ];

  return (
    <div className="relative w-full min-h-screen p-4 pb-24 md:p-8 flex flex-col items-center">
      {/* Navbar */}
      <div className="dash-header w-full max-w-5xl flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 p-2 rounded-lg text-white shadow-lg shadow-sky-600/20">
            <Plane size={24} className="-rotate-45" />
          </div>
          <span className="font-display font-bold text-xl text-sky-900 tracking-tight">ExploreMate</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-white/50 hover:bg-white transition-colors text-slate-600 hover:text-sky-600">
            <Bell size={20} />
          </button>
          <button onClick={onLogout} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
            Log Out
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 p-[2px] shadow-md">
             <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full rounded-full border-2 border-white object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="dash-welcome w-full bg-gradient-to-br from-sky-500 to-sky-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-sky-900/20 relative overflow-hidden group">
            {/* Ambient Background Animation */}
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-3 bg-white/20 w-fit px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-inner">
                  <MapPin size={12} /> Kathmandu, Nepal
                </div>
                <h1 className="text-4xl font-grotesk font-bold mb-2">Namaste, Alex!</h1>
                <p className="text-sky-100 max-w-sm text-lg font-medium">It's a beautiful sunny day. Perfect for visiting Swayambhunath Stupa.</p>
              </div>
              <div className="text-right">
                <Sun size={56} className="mb-2 text-yellow-300 animate-[spin_10s_linear_infinite]" />
                <div className="text-4xl font-grotesk font-bold">24°C</div>
              </div>
            </div>
            <div className="mt-8 p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-4 hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg group-hover:translate-x-1">
               <div className="p-2.5 bg-yellow-400 rounded-xl text-yellow-900 shadow-md"><Compass size={24} /></div>
               <div>
                 <div className="text-sm font-bold">AI Suggestion</div>
                 <div className="text-xs text-sky-100 font-medium">Outdoor visibility is high. Check out the Nagarkot View Tower.</div>
               </div>
               <ArrowRight size={20} className="ml-auto opacity-70" />
            </div>
          </div>

          <div className="dash-search bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/60">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 font-grotesk">
              <Sparkles size={20} className="text-sunset-500 fill-sunset-500" /> AI Itinerary Planner
            </h2>
            <div className="bg-slate-50/80 rounded-2xl p-2 flex items-center border border-slate-200 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-300 transition-all shadow-inner">
               <Search className="text-slate-400 ml-3" size={20} />
               <input type="text" placeholder="Plan a 2-day cultural trip to Bhaktapur..." className="w-full bg-transparent p-3 outline-none text-slate-700 placeholder-slate-400 font-medium" />
               <button className="p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20 active:scale-95 duration-200">
                 <ArrowRight size={20} />
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             {tools.map((tool, index) => (
               <button key={tool.label} className="dash-tool bg-white/70 backdrop-blur-xl p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white hover:scale-[1.05] transition-all duration-300 shadow-sm border border-white/60 group">
                 <div className={`${tool.color} p-3.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow text-white`}>{tool.icon}</div>
                 <span className="text-sm font-bold text-slate-700">{tool.label}</span>
               </button>
             ))}
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/60">
             <div className="flex justify-between items-center mb-4 dash-rec">
               <h3 className="font-bold text-slate-800 font-grotesk text-lg">Top Picks</h3>
               <a href="#" className="text-xs font-bold text-sky-600 hover:text-sky-700 px-3 py-1 bg-sky-50 rounded-full">View All</a>
             </div>
             <div className="space-y-4">
               {[
                 { title: "Boudhanath Stupa", type: "Culture", img: "https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=150&h=150" },
                 { title: "Garden of Dreams", type: "Relax", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=150&h=150" }
               ].map((item, i) => (
                 <div key={i} className="dash-rec flex gap-4 p-2 rounded-2xl hover:bg-white/60 transition-colors cursor-pointer group border border-transparent hover:border-white/50">
                    <img src={item.img} alt={item.title} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                      <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-md w-fit mt-1">{item.type}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Nav */}
      <div className="dash-nav fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-full shadow-2xl z-40 flex items-center gap-8 md:gap-12 hover:scale-105 transition-transform duration-300">
        {['Explore', 'Saved', 'Trips', 'Profile'].map((item, i) => (
          <button key={item} className={`flex flex-col items-center gap-1 transition-colors relative group ${i === 0 ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <div className={`transition-transform duration-300 ${i === 0 ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}>
                {i === 0 && <Compass size={24} />}
                {i === 1 && <Mountain size={24} />}
                {i === 2 && <Calendar size={24} />}
                {i === 3 && <Users size={24} />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item}</span>
            {i === 0 && <div className="absolute -bottom-2 w-1 h-1 bg-sky-600 rounded-full"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;