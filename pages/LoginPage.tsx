import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Compass, Eye, EyeOff, User, MapPin, AlertCircle, Sun, Moon, Cloud, CloudRain, CloudLightning, Snowflake, Wind, CloudDrizzle, CloudMoon } from 'lucide-react';
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

interface WeatherData {
  temp: number;
  code: number;
  isDay: number;
  loading: boolean;
}

const LoginPage = ({ onLogin, onNavigate }: { onLogin: () => void, onNavigate: (page: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    temp: 20,
    code: 0,
    isDay: 1,
    loading: true
  });

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Fetch Weather based on Geolocation
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&temperature_unit=celsius`
            );
            const data = await res.json();
            setWeather({
                temp: Math.round(data.current.temperature_2m),
                code: data.current.weather_code,
                isDay: data.current.is_day,
                loading: false
            });
        } catch (e) {
            console.error("Weather fetch failed", e);
            setWeather(prev => ({ ...prev, loading: false }));
        }
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.warn("Geolocation access denied or failed, defaulting to Kathmandu.", error);
                // Fallback to Kathmandu
                fetchWeather(27.7172, 85.3240);
            }
        );
    } else {
        // Fallback to Kathmandu if geolocation not supported
        fetchWeather(27.7172, 85.3240);
    }
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
    
    // Container Pop In
    tl.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.95, y: 20 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Namaste Text Animation
    if (titleRef.current) {
        // Split text animation for "Namaste"
        const chars = titleRef.current.querySelectorAll('.char');
        tl.fromTo(chars, 
           { y: 20, opacity: 0 },
           { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "back.out(1.7)" },
           "-=0.4"
        );
    }

    // Form Elements Stagger
    if (formRef.current) {
      tl.fromTo(formRef.current.children,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }
    
    // Weather Widget Pop
    tl.fromTo('.weather-widget', 
       { scale: 0, opacity: 0 },
       { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.75)" },
       "-=0.6"
    );

  }, []);

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
      // Logic: Rain/Snow overrides Day/Night, otherwise show Sun/Moon
      if ([45, 48].includes(code)) return <Wind size={24} className="text-slate-400" />;
      if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={24} className="text-blue-400 animate-bounce" />;
      if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake size={24} className="text-sky-200 animate-spin-slow" />;
      if ([95, 96, 99].includes(code)) return <CloudLightning size={24} className="text-purple-500" />;
      if ([56, 57, 66, 67].includes(code)) return <CloudDrizzle size={24} className="text-sky-300" />;

      // Clear or Cloudy
      if (isDay === 0) {
        // Night
        if (code === 0 || code === 1) return <Moon size={24} className="text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" />;
        return <CloudMoon size={24} className="text-slate-400" />;
      } else {
        // Day
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
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10 bg-slate-50">
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors font-bold z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50"
      >
        <ArrowRight size={18} className="rotate-180" /> Home
      </button>

      <div ref={containerRef} className="bg-white w-full max-w-[1100px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] relative">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Weather Widget (Absolute Top Right of the Form Area) */}
          <div className="weather-widget absolute top-8 right-8 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm cursor-help" title='Current local weather'>
             {weather.loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin"></div>
             ) : (
                <>
                   {getWeatherIcon(weather.code, weather.isDay)}
                   <div className="flex flex-col leading-none">
                      <span className="text-xs font-bold text-slate-800">{weather.temp}°C</span>
                      <span className="text-[10px] font-bold text-slate-400">{getWeatherLabel(weather.code, weather.isDay)}</span>
                   </div>
                </>
             )}
          </div>

          <div className="max-w-sm mx-auto w-full relative z-10 mt-8 md:mt-0">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider mb-6 border border-red-100">
                <Compass size={14} /> Explore Nepal
              </div>
              
              {/* Animated Namaste Title */}
              <h1 ref={titleRef} className="text-5xl font-grotesk font-bold text-slate-900 mb-3 tracking-tight flex flex-wrap gap-x-1">
                {"Namaste,".split('').map((char, i) => (
                   <span key={i} className="char inline-block">{char}</span>
                ))}
              </h1>
              
              <p className="text-slate-500 font-medium text-lg">
                Welcome to your gateway to the Himalayas.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors">
                  <input type="checkbox" className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
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
                className={`w-full py-4 bg-sky-900 text-white rounded-2xl font-bold font-grotesk tracking-wide hover:bg-sky-800 transition-all duration-300 shadow-xl shadow-sky-900/10 flex items-center justify-center gap-2 group overflow-hidden relative ${isLoading ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>{isLoading ? 'Verifying...' : 'Log In'}</span>
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to ExploreMate? <button onClick={() => onNavigate('signup')} className="font-bold text-sky-600 hover:text-sky-700 hover:underline">Create Account</button>
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
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
        <div className="w-full md:w-[55%] relative bg-slate-900 overflow-hidden hidden md:block">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
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
                  <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                    {slide.description}
                  </p>
                </div>
               )
            ))}
            
            {/* Slide Indicators */}
            <div className="flex gap-2 mt-8">
              {LOGIN_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'
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