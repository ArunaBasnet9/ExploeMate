import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, User, MapPin, AlertCircle, Sun, Moon, Cloud, CloudRain, Snowflake, CloudLightning, Wind, CloudDrizzle, CloudMoon, Droplets, Thermometer, Sparkles, Cpu } from 'lucide-react';
import { InputField } from '../components/SharedUI';
import { LOGIN_IMAGES } from '../assets/images';

// Nepal Specific Slides for Login
const LOGIN_SLIDES = [
  {
    id: 1,
    image: LOGIN_IMAGES.EVEREST,
    title: "Sagarmatha Calling",
    location: "Mt. Everest, Solukhumbu",
    description: "Stand at the top of the world and breathe in the Himalayas."
  },
  {
    id: 2,
    image: LOGIN_IMAGES.BOUDHANATH,
    title: "Spiritual Harmony",
    location: "Boudhanath, Kathmandu",
    description: "Find your inner peace amidst the ancient chants and prayer flags."
  },
  {
    id: 3,
    image: LOGIN_IMAGES.POKHARA,
    title: "Lakeside Serenity",
    location: "Phewa Lake, Pokhara",
    description: "Witness the reflection of Machhapuchhre on the tranquil waters."
  }
];

// --- AI Text Scramble Component ---
const ScrambleTitle = ({ text, className }: { text: string, className?: string }) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const duration = 2;
    
    gsap.set(el, { opacity: 1 });
    
    let progress = { value: 0 };
    gsap.to(progress, {
        value: 1,
        duration: duration,
        ease: "power4.out",
        onUpdate: () => {
            const p = progress.value;
            const revealLength = Math.floor(text.length * p);
            const revealed = text.substring(0, revealLength);
            const scrambledLength = text.length - revealLength;
            let scrambled = "";
            for (let i = 0; i < scrambledLength; i++) {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
            el.innerText = revealed + scrambled;
        },
        onComplete: () => {
            el.innerText = text; 
        }
    });

  }, [text]);

  return <h1 ref={elementRef} className={className} style={{ opacity: 0 }}>{text}</h1>;
};

interface WeatherData {
  temp: number;
  code: number;
  isDay: number;
  loading: boolean;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
}

const LoginPage = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  
  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    temp: 20,
    code: 0,
    isDay: 1,
    loading: true,
    humidity: 0,
    windSpeed: 0,
    visibility: 10,
    feelsLike: 0
  });

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const weatherRef = useRef<HTMLDivElement>(null);

  // Fetch Weather based on Geolocation - Updates Automatically
  useEffect(() => {
    const fetchWeatherForLocation = async (lat: number, lon: number) => {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,relative_humidity_2m,wind_speed_10m,visibility,apparent_temperature&temperature_unit=celsius&wind_speed_unit=kmh`
            );
            
            if (!res.ok) throw new Error("Weather Service Unavailable");
            const data = await res.json();
            
            if (data && data.current) {
                const current = data.current;
                setWeather({
                    temp: Math.round(current.temperature_2m),
                    code: current.weather_code,
                    isDay: current.is_day,
                    loading: false,
                    humidity: current.relative_humidity_2m ?? 0,
                    windSpeed: current.wind_speed_10m ?? 0,
                    visibility: current.visibility ? current.visibility / 1000 : 10, // km
                    feelsLike: current.apparent_temperature != null ? Math.round(current.apparent_temperature) : Math.round(current.temperature_2m)
                });
            }
        } catch (e) {
            console.error("Weather fetch failed", e);
            setWeather(prev => ({ ...prev, loading: false }));
        }
    };

    const initWeather = async () => {
        setWeather(prev => ({ ...prev, loading: true }));
        
        try {
            // Attempt 1: GPS
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
            });
            await fetchWeatherForLocation(position.coords.latitude, position.coords.longitude);
        } catch (gpsError) {
            try {
                // Attempt 2: IP
                const ipRes = await fetch('https://ipwho.is/');
                const ipData = await ipRes.json();
                if (ipData.success) {
                    await fetchWeatherForLocation(ipData.latitude, ipData.longitude);
                } else {
                    throw new Error("IP Geo failed");
                }
            } catch (ipError) {
                // Attempt 3: Default
                await fetchWeatherForLocation(27.7172, 85.3240);
            }
        }
    };

    initWeather();
    // Refresh weather every 1 minute
    const intervalId = setInterval(initWeather, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOGIN_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Container Pop In with elastic feel
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.95, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.75)" }
    );

    // Form Elements Stagger
    if (formRef.current) {
      tl.fromTo(formRef.current.children,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );
    }
    
    // Weather Widget Pop
    tl.fromTo('.weather-widget', 
       { scale: 0, opacity: 0, rotation: -45 },
       { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
       "-=0.6"
    );

  }, []);

  // Hover animation for weather widget expansion
  useEffect(() => {
      if (weatherRef.current) {
          if (isWeatherExpanded) {
              gsap.to(weatherRef.current, { width: 280, height: 160, borderRadius: '1.5rem', backgroundColor: '#ffffff', duration: 0.4, ease: 'power2.out' });
              gsap.to('.weather-details', { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
          } else {
              gsap.to(weatherRef.current, { width: 'auto', height: 48, borderRadius: '9999px', backgroundColor: '#f8fafc', duration: 0.4, ease: 'power2.inOut' });
              gsap.to('.weather-details', { opacity: 0, y: 10, duration: 0.2 });
          }
      }
  }, [isWeatherExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'rashojban@gmail.com' && password === '12345') {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Try using the temporary login below.');
        if (formRef.current) {
          gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.1, repeat: 5, yoyo: true });
        }
      }
    }, 1500);
  };

  const getWeatherIcon = (code: number, isDay: number) => {
      if ([45, 48].includes(code)) return <Wind size={24} className="text-slate-400" />;
      if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={24} className="text-blue-400 animate-bounce" />;
      if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake size={24} className="text-sky-200 animate-spin-slow" />;
      if ([95, 96, 99].includes(code)) return <CloudLightning size={24} className="text-purple-500" />;
      if ([56, 57, 66, 67].includes(code)) return <CloudDrizzle size={24} className="text-sky-300" />;

      if (isDay === 0) {
        if (code === 0 || code === 1) return <Moon size={24} className="text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" />;
        return <CloudMoon size={24} className="text-slate-400" />;
      } else {
        if (code === 0 || code === 1) return <Sun size={24} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-[spin_10s_linear_infinite]" />;
        return <Cloud size={24} className="text-slate-400" />;
      }
  };

  const getWeatherLabel = (code: number, isDay: number) => {
     if (code >= 51 && code <= 99) return "Rainy";
     if (isDay === 0) return "Clear Night";
     return "Sunny Day";
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10 bg-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-sky-200/50 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-purple-200/50 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50"
      >
        <ArrowRight size={18} className="rotate-180" /> Home
      </button>

      <div ref={containerRef} className="bg-white/80 backdrop-blur-2xl w-full max-w-[1200px] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] relative border border-white/60">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-[45%] p-8 md:p-14 flex flex-col justify-center relative z-10">
          
          {/* Weather Widget (Expandable on Hover) */}
          <div 
            ref={weatherRef}
            className="weather-widget absolute top-8 right-8 flex flex-col items-start bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-md cursor-help overflow-hidden z-20 transition-all hover:shadow-xl"
            onMouseEnter={() => setIsWeatherExpanded(true)}
            onMouseLeave={() => setIsWeatherExpanded(false)}
          >
             {weather.loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin m-1"></div>
             ) : (
                <>
                   <div className="flex items-center gap-3 w-full h-8">
                       {getWeatherIcon(weather.code, weather.isDay)}
                       <div className="flex flex-col leading-none">
                          <span className="text-xs font-bold text-slate-800">{weather.temp}°C</span>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{getWeatherLabel(weather.code, weather.isDay)}</span>
                       </div>
                   </div>

                   <div className="weather-details opacity-0 w-full mt-4 grid grid-cols-2 gap-3 text-slate-600">
                       <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                               <Droplets size={12} /> <span className="text-[10px] font-bold uppercase">Humidity</span>
                           </div>
                           <span className="text-sm font-bold">{weather.humidity}%</span>
                       </div>
                       <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                               <Wind size={12} /> <span className="text-[10px] font-bold uppercase">Wind</span>
                           </div>
                           <span className="text-sm font-bold">{weather.windSpeed} km/h</span>
                       </div>
                       <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                               <Eye size={12} /> <span className="text-[10px] font-bold uppercase">Vis</span>
                           </div>
                           <span className="text-sm font-bold">{weather.visibility.toFixed(1)} km</span>
                       </div>
                       <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                               <Thermometer size={12} /> <span className="text-[10px] font-bold uppercase">Feels</span>
                           </div>
                           <span className="text-sm font-bold">{weather.feelsLike}°</span>
                       </div>
                   </div>
                </>
             )}
          </div>

          <div className="max-w-sm mx-auto w-full relative z-10 mt-12 md:mt-0">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 font-bold text-xs uppercase tracking-wider mb-6 border border-sky-100 animate-pulse">
                <Cpu size={14} /> AI-Powered Access
              </div>
              
              {/* AI Scramble Title */}
              <ScrambleTitle 
                text="Namaste, Explorer" 
                className="text-5xl font-grotesk font-bold text-slate-900 mb-3 tracking-tight leading-tight" 
              />
              
              <p className="text-slate-500 font-medium text-lg">
                Your intelligent journey through the Himalayas begins here.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <InputField 
                label="Email Address" 
                type="email" 
                placeholder="rashojban@gmail.com" 
                required 
                icon={<User size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="relative">
                <InputField 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="•••••" 
                  required 
                  icon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-sky-600 transition-colors focus:outline-none">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-slate-500 pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors group">
                  <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center group-hover:border-sky-500 transition-colors">
                      <input type="checkbox" className="appearance-none" />
                      <div className="w-3 h-3 bg-sky-500 rounded-sm opacity-0 check-anim"></div>
                  </div>
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-sky-600 hover:text-sky-700 hover:underline">Forgot Password?</button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-500 text-sm font-medium animate-in slide-in-from-top-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full py-4 bg-sky-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-sky-800 transition-all duration-300 shadow-xl shadow-sky-900/20 flex items-center justify-center gap-2 group overflow-hidden relative ${isLoading ? 'cursor-not-allowed opacity-90' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>{isLoading ? 'Authenticating...' : 'Log In'}</span>
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to ExploreMate? <button onClick={() => onNavigate('signup')} className="font-bold text-sky-600 hover:text-sky-700 hover:underline">Create Account</button>
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center backdrop-blur-sm">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Demo Credentials</p>
              <div className="flex justify-center gap-4 text-xs font-mono text-slate-600 bg-white py-2 rounded-lg border border-slate-100 shadow-sm">
                <span>User: rashojban@gmail.com</span>
                <span className="w-px h-4 bg-slate-200"></span>
                <span>Pass: 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Slideshow */}
        <div className="w-full md:w-[55%] relative bg-slate-900 overflow-hidden hidden md:block rounded-r-[3rem]">
          {LOGIN_SLIDES.map((slide, index) => (
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
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
              <div className="absolute inset-0 bg-sky-900/20 mix-blend-overlay"></div>
            </div>
          ))}

          {/* Text Content Layer */}
          <div className="absolute bottom-0 left-0 w-full p-12 z-20">
            {LOGIN_SLIDES.map((slide, index) => (
               index === currentSlide && (
                <div key={slide.id} className="animate-in slide-in-from-bottom-4 fade-in duration-700">
                  <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-widest text-xs mb-3">
                    <MapPin size={14} /> {slide.location}
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-300 text-lg max-w-md leading-relaxed backdrop-blur-sm bg-black/10 p-2 rounded-lg">
                    {slide.description}
                  </p>
                </div>
               )
            ))}
            
            {/* Slide Indicators */}
            <div className="flex gap-2 mt-10">
              {LOGIN_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                    i === currentSlide ? 'w-12 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Decorative Weather Overlay Element */}
          {weather.code >= 51 && weather.code <= 67 && (
             <div className="absolute inset-0 pointer-events-none bg-[url('https://cdn.pixabay.com/animation/2023/06/25/19/27/rain-8088037_1280.gif')] opacity-20 mix-blend-screen bg-cover"></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;