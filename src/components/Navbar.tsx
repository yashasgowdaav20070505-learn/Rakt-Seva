import React, { useState, useRef, useEffect } from 'react';
import { UserRole, NotificationAlert } from '../types';
import { CitizenUser, OrgUser } from './Auth/LoginPage';
import { 
  Droplet, 
  Bell, 
  Radio, 
  Menu, 
  X, 
  Heart, 
  MapPin, 
  Building2,
  LogOut,
  Edit3,
  ShieldCheck,
  CreditCard,
  Award,
  ChevronDown,
  UserCheck,
  Users
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguage, TRANSLATIONS } from '../services/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: CitizenUser | null;
  currentOrg: OrgUser | null;
  citizenMode?: 'donor' | 'requester';
  notifications: NotificationAlert[];
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenNotifications: () => void;
  onOpenEditProfile: () => void;
  onOpenVerificationCenter?: () => void;
  onOpenDonorCard?: () => void;
  onOpenBadges?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentOrg,
  citizenMode = 'donor',
  notifications,
  currentLanguage,
  onLanguageChange,
  onOpenNotifications,
  onOpenEditProfile,
  onOpenVerificationCenter,
  onOpenDonorCard,
  onOpenBadges,
  onLogout
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter navigation items specifically for the active category and citizen mode
  const navItems = currentUser ? [
    { id: 'citizen', label: t.appName ? `${t.appName} Portal` : 'Citizen Portal', icon: Heart },
    { 
      id: 'sos', 
      label: citizenMode === 'donor' ? 'Emergency SOS' : 'Donor List', 
      icon: citizenMode === 'donor' ? Radio : Users 
    },
    { id: 'map', label: t.mapTitle || 'Google Maps Radar', icon: MapPin },
  ] : currentOrg ? [
    { id: 'host', label: 'Camp Host Dashboard', icon: Building2 },
    { id: 'map', label: 'Google Maps Outreach', icon: MapPin },
  ] : [
    { id: 'citizen', label: 'Citizen Portal', icon: Heart },
    { id: 'host', label: 'Organization Portal', icon: Building2 },
  ];

  const profilePhotoUrl = currentUser?.photoUrl || currentOrg?.logoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80';
  const profileDisplayName = currentUser?.name || currentOrg?.orgName || 'User';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo: Clean "Rakt Seva" only */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={() => setActiveTab(currentUser ? 'citizen' : currentOrg ? 'host' : 'citizen')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#C92A2A] text-white flex items-center justify-center shadow-md shadow-rose-950/20">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-slate-900 leading-none">
              Rakt Seva
            </div>
            <div className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mt-0.5">
              {currentUser ? 'Citizen Portal (Donor & Requester)' : currentOrg ? 'Camp Host Organization' : 'National Blood Grid'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Language Selector, Notifications, and ONLY Profile Photo with Dropdown */}
        <div className="flex items-center gap-3">
          {/* Multilingual Selector (English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi) */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />

          {/* Notification Icon */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-rose-50 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ONLY PROFILE PHOTO (Clicking opens dropdown with edit profile, verification, donor card, badges, and logout) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="relative p-0.5 rounded-2xl transition-all focus:outline-none hover:ring-2 hover:ring-rose-400"
              title="Click for Profile, Verification & Logout"
              aria-label="User Profile Menu"
            >
              <img
                src={profilePhotoUrl}
                alt={profileDisplayName}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-rose-300 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl shadow-rose-950/20 border border-rose-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                {/* User Summary Header */}
                <div className="p-3 bg-gradient-to-r from-rose-50 to-[#FFF5F4] rounded-2xl border border-rose-100 flex items-center gap-3 mb-1.5">
                  <img
                    src={profilePhotoUrl}
                    alt={profileDisplayName}
                    className="w-12 h-12 rounded-2xl object-cover border border-rose-200 shadow-xs"
                  />
                  <div className="overflow-hidden">
                    <div className="font-black text-slate-900 text-sm truncate leading-tight">
                      {profileDisplayName}
                    </div>
                    <div className="text-[11px] font-bold text-rose-700 mt-0.5 flex items-center gap-1">
                      {currentUser && <span>Group {currentUser.bloodGroup} · Donor</span>}
                      {currentOrg && <span>{currentOrg.orgType}</span>}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>UIDAI & Mobile Verified</span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="space-y-0.5 py-1">
                  {/* Edit Profile & Photo */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenEditProfile();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-slate-700 hover:bg-rose-50 hover:text-slate-900 font-bold flex items-center gap-2.5 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-slate-400" />
                    <span>{t.editProfileOption || 'Edit Profile & Photo'}</span>
                  </button>

                  {/* Verification Center (Mobile, Email, Aadhaar) */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onOpenVerificationCenter) onOpenVerificationCenter();
                      else onOpenEditProfile();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-slate-700 hover:bg-rose-50 hover:text-slate-900 font-bold flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.verificationOption || 'Verification Center (Mobile, Email, Aadhaar)'}</span>
                  </button>

                  {/* Donor Card (Moved to profile section) */}
                  {currentUser && onOpenDonorCard && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenDonorCard();
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-slate-700 hover:bg-rose-50 hover:text-slate-900 font-bold flex items-center gap-2.5 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-rose-600" />
                      <span>{t.donorCardOption || 'My Digital Donor Card'}</span>
                    </button>
                  )}

                  {/* Badges & Certificates (Moved to profile section) */}
                  {currentUser && onOpenBadges && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenBadges();
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-slate-700 hover:bg-rose-50 hover:text-slate-900 font-bold flex items-center gap-2.5 transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{t.badgesOption || 'My Lifesaver Badges & Certificates'}</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-rose-100 my-1 pt-1">
                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-left text-rose-700 hover:bg-rose-600 hover:text-white font-black flex items-center gap-2.5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logoutOption || 'Log Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2.5 ${
                  isActive ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-rose-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-rose-100 space-y-1">
            <button
              type="button"
              onClick={() => {
                onOpenEditProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-slate-400" />
              <span>{t.editProfileOption || 'Edit Profile & Verification'}</span>
            </button>
            {currentUser && onOpenDonorCard && (
              <button
                type="button"
                onClick={() => {
                  onOpenDonorCard();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>{t.donorCardOption || 'My Digital Donor Card'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logoutOption || 'Log Out'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
