import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../services/i18n';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-200/80 text-xs font-bold transition-all shadow-2xs"
        aria-label="Change Language"
        title="Change application language"
      >
        <Globe className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span className="font-extrabold">{activeLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-rose-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-rose-950/15 border border-rose-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-rose-50 mb-1">
            Choose Language / ಭಾಷೆ
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-rose-50/50">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected ? 'bg-rose-50/90 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      {lang.flag}
                    </span>
                    <div>
                      <div className="font-bold leading-tight">{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
