import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, icon, error, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`group relative mb-6`}>
      <label 
        className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300 ${
          isFocused ? 'text-sky-600' : 'text-slate-400'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full px-4 py-4 bg-sky-50/50 border-2 rounded-xl text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-medium
            ${error 
              ? 'border-red-400 bg-red-50' 
              : isFocused 
                ? 'border-sky-500 bg-white shadow-[0_10px_30px_-10px_rgba(14,165,233,0.2)]' 
                : 'border-slate-200 hover:border-sky-300 hover:bg-white'
            }
            ${className}
          `}
        />
        {icon && (
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-sky-500' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{error}</p>}
    </div>
  );
};

export const GlobalAestheticBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-sky-100 to-sunset-50"></div>
    <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-sunset-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
    <div className="absolute top-[40%] right-[30%] w-[20vw] h-[20vw] bg-white/60 rounded-full mix-blend-overlay filter blur-[60px]"></div>
  </div>
);
