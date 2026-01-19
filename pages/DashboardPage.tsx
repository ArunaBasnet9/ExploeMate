import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MapPin, Languages, QrCode, Users, Plane, Bell, Sun, Moon, CloudMoon, Compass, ArrowRight, Sparkles, Search, Mountain, Calendar, User, Cloud, CloudRain, Snowflake, CloudLightning, Wind, CloudDrizzle, Droplets, Eye, Thermometer, BrainCircuit } from 'lucide-react';

interface WeatherData {
  temp: number;
  code: number;
  isDay: number; // 1 = Day, 0 = Night
  location: string;
  loading: boolean;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
}

const DashboardPage = ({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (page: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [weather, setWeather] = useState<WeatherData>({
    temp: 0,
    code: 0,
    isDay: 1, 
    location: 'Locating...', 
    loading: true,
    humidity: 0,
    windSpeed: 0,
    visibility: 10,
    feelsLike: 0
  });

  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  // Weather Description Helper
  const getWeatherDescription = (code: number) => {
      if (code === 0) return "Clear skies";
      if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
      if (code >= 51 && code <= 67) return "Rainy";
      if (code >= 71 && code <= 77) return "Snowy";
      if (code >= 95) return "Thunderstorms";
      return "Overcast";
  };

  useEffect(() => {
    const fetchWeatherForLocation = async (lat: number, lon: number, cityFallback?: string) => {
        try {
            // 1. Fetch Weather Data
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,relative_humidity_2m,wind_speed_10m,visibility,apparent_temperature&temperature_unit=celsius&wind_speed_unit=kmh`
            );
            
            if (!weatherRes.ok) throw new Error("Weather API Error");
            const weatherInfo = await weatherRes.json();

            // 2. Determine Location Name
            let locationName = cityFallback || "Unknown Location";
            
            if (!cityFallback) {
                try {
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        const addr = geoData.address || {};
                        locationName = addr.city || addr.town || addr.village || addr.municipality || addr.county || geoData.name || "Local Area";
                    }
                } catch (e) {
                    console.warn("Reverse geocoding failed", e);
                    locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                }
            }

            // 3. Update State
            if (weatherInfo && weatherInfo.current) {
                const current = weatherInfo.current;
                setWeather({
                    temp: Math.round(current.temperature_2m),
                    code: current.weather_code,
                    isDay: current.is_day,
                    location: locationName,
                    loading: false,
                    humidity: current.relative_humidity_2m ?? 0,
                    windSpeed: current.wind_speed_10m ?? 0,
                    visibility: current.visibility ? current.visibility / 1000 : 10, // Convert m to km
                    feelsLike: current.apparent_temperature != null ? Math.round(current.apparent_temperature) : Math.round(current.temperature_2m)
                });
            }
        } catch (error) {
            console.error("Failed to fetch weather:", error);
            setWeather(prev => ({ ...prev, loading: false, location: "Unavailable" }));
        }
    };

    const initWeather = async () => {
        // Only set loading on first load, not during background refreshes
        setWeather(prev => ({ ...prev, loading: prev.location === 'Locating...' }));
        
        try {
            // Attempt 1: Browser Geolocation (GPS)
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
            });
            
            await fetchWeatherForLocation(position.coords.latitude, position.coords.longitude);
            
        } catch (gpsError) {
            console.warn("GPS failed or denied, trying IP geolocation...", gpsError);
            
            try {
                // Attempt 2: IP Geolocation (ipwho.is is free and CORS friendly)
                const ipRes = await fetch('https://ipwho.is/');
                const ipData = await ipRes.json();
                
                if (ipData.success) {
                    await fetchWeatherForLocation(ipData.latitude, ipData.longitude, ipData.city);
                } else {
                    throw new Error("IP Geolocation failed");
                }
            } catch (ipError) {
                console.error("All location methods failed, defaulting to Kathmandu.", ipError);
                // Attempt 3: Default (Kathmandu)
                await fetchWeatherForLocation(27.7172, 85.3240, "Kathmandu");
            }
        }
    };

    initWeather();
    
    // Refresh every 1 minute (60000ms)
    const interval = setInterval(initWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- AI Suggestion Engine ---
  useEffect(() => {
    const generateSmartSuggestion = () => {
        if (weather.loading || weather.location === 'Locating...') return;

        setIsAiLoading(true);

        const timeout = setTimeout(() => {
            let options: string[] = [];
            const loc = weather.location.toLowerCase();
            const isRaining = weather.code >= 51 && weather.code <= 67;
            const isClear = weather.code <= 1;
            const isNight = weather.isDay === 0;

            // Simple Logic Tree
            if (isRaining) {
                options = ["Visit a local museum indoors.", "Find a cozy cafe nearby.", "Explore covered markets."];
            } else if (isNight) {
                options = ["Enjoy the local nightlife.", "Find a rooftop dinner spot.", "Take a peaceful evening walk."];
            } else if (isClear) {
                options = ["Great time for a scenic viewpoint.", "Perfect weather for a walk.", "Take some outdoor photos."];
            } else {
                options = ["Explore the city center.", "Visit popular local landmarks.", "Try local street food."];
            }

            // Add location context if known
            if (loc.includes('kathmandu')) {
                if (isClear) options.push("Visit Swayambhunath for the view.");
                if (isNight) options.push("Thamel is lively right now.");
            }

            setAiSuggestion(options[Math.floor(Math.random() * options.length)]);
            setIsAiLoading(false);
        }, 1200);

        return () => clearTimeout(timeout);
    };

    generateSmartSuggestion();
  }, [weather.loading, weather.code, weather.isDay, weather.location]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Header
      tl.fromTo('.dash-header', 
          { y: -30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      // 2. Welcome Card (Main Feature)
      tl.fromTo('.dash-welcome',
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.75)' },
          "-=0.6"
      );

      // 3. Text Reveal
      tl.fromTo('.reveal-text-char', 
          { y: 50, opacity: 0, skewY: 10, rotateZ: 5 },
          { y: 0, opacity: 1, skewY: 0, rotateZ: 0, stagger: 0.03, duration: 1, ease: 'power4.out' },
          "-=0.5"
      );

      // 4. Search Bar
      tl.fromTo('.dash-search',
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          "-=0.8"
      );

      // 5. Tools Grid
      tl.fromTo('.dash-tool',
          { scale: 0.5, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(2)' },
          "-=0.4"
      );

      // 6. Recommendations
      tl.fromTo('.dash-rec',
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
          "-=0.2"
      );

      // 7. Mobile Nav
      tl.fromTo('.dash-nav-mobile',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          "-=0.6"
      );
      
      // Floating Animations
      gsap.to('.weather-icon-anim', {
         y: -10,
         duration: 2,
         repeat: -1,
         yoyo: true,
         ease: 'sine.inOut'
      });
      
      gsap.to('.floating-blob', {
          y: -15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="reveal-text-char inline-block whitespace-pre origin-bottom will-change-transform">
        {char}
      </span>
    ));
  };

  const onToolHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
      const target = e.currentTarget;
      const iconBox = target.querySelector('.tool-icon-box');
      const label = target.querySelector('.tool-label');
      
      if(enter) {
          gsap.to(target, { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', scale: 1.02, duration: 0.3 });
          gsap.to(iconBox, { rotate: 10, scale: 1.1, duration: 0.4, ease: 'back.out(1.5)' });
          gsap.to(label, { color: '#0284c7', duration: 0.3 });
      } else {
          gsap.to(target, { y: 0, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', scale: 1, duration: 0.3 });
          gsap.to(iconBox, { rotate: 0, scale: 1, duration: 0.4 });
          gsap.to(label, { color: '#334155', duration: 0.3 });
      }
  };

  const tools = [
    { icon: <MapPin className="text-white" size={20} />, label: "Route Optimizer", color: "bg-emerald-500", shadow: "shadow-emerald-500/30", action: () => onNavigate('route-optimizer') },
    { icon: <Languages className="text-white" size={20} />, label: "Translator", color: "bg-blue-500", shadow: "shadow-blue-500/30", action: () => onNavigate('translator') },
    { icon: <QrCode className="text-white" size={20} />, label: "QR Guide", color: "bg-purple-500", shadow: "shadow-purple-500/30", action: () => onNavigate('qr-guide') },
    { icon: <Users className="text-white" size={20} />, label: "Group Plan", color: "bg-orange-500", shadow: "shadow-orange-500/30", action: () => onNavigate('group-plan') },
  ];

  const navItems = [
    { label: 'Explore', icon: Compass, page: 'dashboard' },
    { label: 'Saved', icon: Mountain, page: 'saved' },
    { label: 'Trips', icon: Calendar, page: 'trips' },
    { label: 'Profile', icon: User, page: 'profile' }
  ];

  const getWeatherIcon = (code: number, isDay: number) => {
      // Prioritize distinct conditions (Rain/Snow/Thunder)
      if ([45, 48].includes(code)) return <Wind size={64} className="weather-icon-anim mb-2 text-slate-300 drop-shadow-md" />;
      if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={64} className="weather-icon-anim mb-2 text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]" />;
      if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake size={64} className="weather-icon-anim mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />;
      if ([95, 96, 99].includes(code)) return <CloudLightning size={64} className="weather-icon-anim mb-2 text-purple-300 drop-shadow-[0_0_15px_rgba(216,180,254,0.6)]" />;
      if ([56, 57, 66, 67].includes(code)) return <CloudDrizzle size={64} className="weather-icon-anim mb-2 text-sky-200" />;

      // For Clear/Cloudy, check Day vs Night
      if (isDay === 0) {
        // Night Time Icons
        if (code === 0 || code === 1) return <Moon size={64} className="weather-icon-anim mb-2 text-slate-200 drop-shadow-[0_0_15px_rgba(226,232,240,0.6)]" />;
        if (code === 2 || code === 3) return <CloudMoon size={64} className="weather-icon-anim mb-2 text-slate-300 drop-shadow-md" />;
      } else {
        // Day Time Icons
        if (code === 0 || code === 1) return <Sun size={64} className="weather-icon-anim mb-2 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]" />;
        if (code === 2) return <Cloud size={64} className="weather-icon-anim mb-2 text-gray-100 drop-shadow-md" />;
        if (code === 3) return <Cloud size={64} className="weather-icon-anim mb-2 text-gray-300 drop-shadow-md" />;
      }
      
      // Fallback
      return <Cloud size={64} className="weather-icon-anim mb-2 text-gray-200 drop-shadow-md" />;
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen p-4 pb-24 md:p-8 flex flex-col items-center bg-slate-50/50">
      {/* Navbar (Header + Desktop Nav) */}
      <div className="dash-header w-full max-w-6xl flex items-center justify-between mb-8 z-20 relative">
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
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${i === 0 ? 'bg-slate-900 text-white shadow-md transform scale-105' : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'}`}
             >
                <item.icon size={16} className={i === 0 ? 'fill-white' : ''} />
                {item.label}
             </button>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => onNavigate('notifications')}
            className="p-2.5 rounded-full bg-white transition-colors relative border border-slate-100 shadow-sm hover:shadow-md text-slate-600 hover:text-sky-600"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          <button onClick={onLogout} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors hidden sm:block">
            Log Out
          </button>
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 p-[2px] shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => onNavigate('profile')}>
             <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full rounded-full border-2 border-white object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        <div className="lg:col-span-2 space-y-6">
          <div className={`dash-welcome w-full rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group min-h-[420px] flex flex-col justify-between transition-all duration-500 hover:shadow-sky-500/30 ${
            weather.isDay === 0 
              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 shadow-slate-900/30' 
              : 'bg-gradient-to-br from-sky-500 to-sky-700 shadow-sky-900/20'
          }`}>
            {/* Ambient Background Animation */}
            <div className={`floating-blob absolute top-[-50%] right-[-10%] w-[450px] h-[450px] rounded-full blur-3xl transition-colors duration-700 ${
              weather.isDay === 0 ? 'bg-indigo-500/20 group-hover:bg-indigo-400/30' : 'bg-white/10 group-hover:bg-white/20'
            }`}></div>
            
            {/* Additional Night Stars if Night */}
            {weather.isDay === 0 && (
               <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-20 right-40 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-32 left-10 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
               </div>
            )}

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg">
                  <MapPin size={12} className={weather.loading ? "animate-spin" : "animate-bounce"} /> 
                  <span className="truncate max-w-[150px] sm:max-w-none">
                    {weather.loading ? "Locating..." : weather.location}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-grotesk font-bold mb-3 tracking-tight overflow-hidden">
                    {splitText(weather.isDay === 0 ? "Good Evening, Rashoj!" : "Namaste, Rashoj!")}
                </h1>
                <p className="text-sky-100 max-w-md text-lg font-medium leading-relaxed opacity-90 pr-2">
                    {weather.loading ? (
                        <span className="animate-pulse">Checking local weather conditions...</span>
                    ) : (
                        <>
                           It's {getWeatherDescription(weather.code).toLowerCase()} {weather.isDay === 0 ? "tonight" : "today"}. 
                           {weather.code < 3 
                              ? (weather.isDay === 0 ? " Enjoy the clear night sky." : " Perfect for outdoor exploration.") 
                              : " Maybe check out some indoor museums."}
                        </>
                    )}
                </p>
              </div>
              <div className="text-right shrink-0">
                 {weather.loading ? (
                     <div className="flex flex-col items-end gap-2 animate-pulse opacity-50">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full"></div>
                        <div className="w-16 h-8 md:w-20 md:h-12 bg-white/20 rounded-xl"></div>
                     </div>
                 ) : (
                     <div className="transform scale-75 origin-top-right md:scale-100 transition-transform">
                        {getWeatherIcon(weather.code, weather.isDay)}
                        <div className="text-5xl font-grotesk font-bold tracking-tighter">{weather.temp}°</div>
                     </div>
                 )}
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 relative z-10">
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col justify-center">
                   <div className="flex items-center gap-1.5 text-sky-100 mb-1">
                      <Droplets size={14} className="opacity-80" /> <span className="text-xs font-bold uppercase tracking-wide opacity-80">Humidity</span>
                   </div>
                   <div className="text-xl font-bold font-grotesk">{weather.humidity}%</div>
               </div>
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col justify-center">
                   <div className="flex items-center gap-1.5 text-sky-100 mb-1">
                      <Wind size={14} className="opacity-80" /> <span className="text-xs font-bold uppercase tracking-wide opacity-80">Wind</span>
                   </div>
                   <div className="text-xl font-bold font-grotesk">{weather.windSpeed} km/h</div>
               </div>
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col justify-center">
                   <div className="flex items-center gap-1.5 text-sky-100 mb-1">
                      <Eye size={14} className="opacity-80" /> <span className="text-xs font-bold uppercase tracking-wide opacity-80">Visibility</span>
                   </div>
                   <div className="text-xl font-bold font-grotesk">{weather.visibility.toFixed(1)} km</div>
               </div>
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col justify-center">
                   <div className="flex items-center gap-1.5 text-sky-100 mb-1">
                      <Thermometer size={14} className="opacity-80" /> <span className="text-xs font-bold uppercase tracking-wide opacity-80">Feels Like</span>
                   </div>
                   <div className="text-xl font-bold font-grotesk">{weather.feelsLike}°</div>
               </div>
            </div>

            <div 
                className="mt-6 p-1 rounded-2xl bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-colors cursor-pointer group/suggestion shadow-lg relative z-10"
                onClick={() => onNavigate('ai-suggestion')}
            >
               <div className="bg-black/5 rounded-[13px] p-4 flex items-center gap-4 hover:bg-black/10 transition-colors">
                  <div className="p-3 bg-yellow-400 rounded-xl text-yellow-900 shadow-md shrink-0 group-hover/suggestion:scale-110 transition-transform duration-300">
                      {isAiLoading ? <BrainCircuit size={24} className="animate-pulse" /> : <Compass size={24} />}
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold flex items-center gap-2 uppercase tracking-wider text-sky-100 mb-1">
                        AI Suggestion
                        {isAiLoading && <Sparkles size={10} className="animate-spin text-sky-200" />}
                    </div>
                    <div className="text-base text-white font-bold leading-tight">
                        {isAiLoading ? (
                            <span className="opacity-70 animate-pulse">Analyzing weather & time...</span>
                        ) : (
                            aiSuggestion || "Explore the vibrant streets of Thamel."
                        )}
                    </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full group-hover/suggestion:translate-x-1 transition-transform">
                     <ArrowRight size={20} className="text-white" />
                  </div>
               </div>
            </div>
          </div>

          <div className="dash-search bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2 font-grotesk">
              <Sparkles size={24} className="text-sunset-500 fill-sunset-500 animate-pulse" /> 
              <span>AI Itinerary Planner</span>
            </h2>
            <div className="bg-slate-50 rounded-2xl p-2 flex items-center border border-slate-200 focus-within:ring-4 focus-within:ring-sky-100 focus-within:border-sky-400 transition-all shadow-inner group/search">
               <Search className="text-slate-400 ml-4 shrink-0 group-focus-within/search:text-sky-500 transition-colors" size={22} />
               <input 
                  type="text" 
                  placeholder="Plan a 2-day cultural trip to Bhaktapur..." 
                  className="w-full bg-transparent p-4 outline-none text-slate-700 placeholder-slate-400 font-medium text-lg" 
               />
               <button className="p-4 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 active:scale-95 duration-200 shrink-0 flex items-center gap-2 font-bold pr-6 group/btn">
                 <span>Plan</span>
                 <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             {tools.map((tool, index) => (
               <button 
                key={tool.label} 
                className="dash-tool bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-white/60 transition-all duration-300"
                onMouseEnter={(e) => onToolHover(e, true)}
                onMouseLeave={(e) => onToolHover(e, false)}
                onClick={tool.action}
               >
                 <div className={`tool-icon-box ${tool.color} p-4 rounded-2xl shadow-lg ${tool.shadow} text-white transition-transform duration-300`}>
                    {tool.icon}
                 </div>
                 <span className="tool-label text-sm font-bold text-slate-700 transition-colors duration-300">{tool.label}</span>
               </button>
             ))}
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/60 h-full flex flex-col">
             <div className="flex justify-between items-center mb-6 dash-rec">
               <h3 className="font-bold text-slate-800 font-grotesk text-xl">Top Picks</h3>
               <button onClick={() => onNavigate('saved')} className="text-xs font-bold text-sky-600 hover:text-white hover:bg-sky-600 px-4 py-2 bg-sky-50 rounded-full transition-all duration-300">View All</button>
             </div>
             <div className="space-y-4 flex-grow">
               {[
                 { title: "Boudhanath Stupa", type: "Culture", rating: 4.9, img: "https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=150&h=150" },
                 { title: "Garden of Dreams", type: "Relax", rating: 4.7, img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=150&h=150" },
                 { title: "Thamel Market", type: "Shopping", rating: 4.5, img: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=150&h=150" }
               ].map((item, i) => (
                 <div key={i} className="dash-rec flex gap-4 p-3 rounded-2xl hover:bg-white transition-all duration-300 cursor-pointer group border border-transparent hover:border-sky-100 hover:shadow-lg">
                    <div className="overflow-hidden rounded-2xl w-16 h-16 shrink-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">{item.type}</span>
                         <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">★ {item.rating}</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Nav (Mobile Only) */}
      <div className="dash-nav-mobile md:hidden fixed bottom-4 left-4 right-4 bg-gradient-to-tr from-sky-600 via-blue-600 to-sky-700 backdrop-blur-xl border border-white/20 py-4 px-8 rounded-2xl shadow-xl shadow-sky-900/20 z-50 flex items-center justify-between ring-1 ring-white/20">
        {navItems.map((item, i) => {
           // For DashboardPage, highlight index 0 (Explore) by default
           const isActive = i === 0;
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

export default DashboardPage;