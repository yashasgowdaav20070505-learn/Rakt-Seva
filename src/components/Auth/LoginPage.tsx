import React, { useState } from 'react';
import { BloodGroup } from '../../types';
import { 
  Heart, 
  Building2, 
  Droplet, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Zap,
  Upload
} from 'lucide-react';

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  gender: 'Male' | 'Female' | 'Other';
  location: string;
  photoUrl: string;
  totalDonations: number;
}

export interface OrgUser {
  id: string;
  orgName: string;
  orgType: 'NGO' | 'College Club / NSS' | 'Corporate CSR' | 'Hospital Trust';
  registrationNumber: string;
  email: string;
  phone: string;
  location: string;
  logoUrl: string;
  campsHosted: number;
}

interface LoginPageProps {
  onCitizenLogin: (user: CitizenUser) => void;
  onOrgLogin: (org: OrgUser) => void;
}

const CITIZEN_PHOTO_PRESETS = [
  { label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80' },
];

const ORG_LOGO_PRESETS = [
  { label: 'Rotary / NGO', url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Youth Club', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Medical Trust', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&h=200&q=80' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onCitizenLogin, onOrgLogin }) => {
  const [activeCategory, setActiveCategory] = useState<'citizen' | 'organization'>('citizen');

  // Citizen Login Form State
  const [citizenEmail, setCitizenEmail] = useState('rahul.sharma@example.com');
  const [citizenPassword, setCitizenPassword] = useState('password123');
  const [citizenName, setCitizenName] = useState('Rahul Sharma');
  const [citizenBloodGroup, setCitizenBloodGroup] = useState<BloodGroup>('O+');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [citizenLocation, setCitizenLocation] = useState('Worli, Mumbai');
  const [citizenPhoto, setCitizenPhoto] = useState<string>(CITIZEN_PHOTO_PRESETS[0].url);

  // Organization Login Form State
  const [orgEmail, setOrgEmail] = useState('contact@rotary3141.org');
  const [orgPassword, setOrgPassword] = useState('hostpass123');
  const [orgName, setOrgName] = useState('Rotary Club of Central Mumbai');
  const [orgType, setOrgType] = useState<OrgUser['orgType']>('NGO');
  const [orgRegNo, setOrgRegNo] = useState('REG-MH-2018-8841');
  const [orgPhone, setOrgPhone] = useState('+91 98200 12345');
  const [orgLocation, setOrgLocation] = useState('Central Mumbai');
  const [orgLogo, setOrgLogo] = useState<string>(ORG_LOGO_PRESETS[0].url);

  const handleCitizenPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCitizenPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOrgLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setOrgLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onCitizenLogin({
      id: 'CITIZEN-101',
      name: citizenName,
      email: citizenEmail,
      phone: citizenPhone,
      bloodGroup: citizenBloodGroup,
      gender: 'Male',
      location: citizenLocation,
      photoUrl: citizenPhoto,
      totalDonations: 8
    });
  };

  const submitOrgLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onOrgLogin({
      id: 'HOST-01',
      orgName,
      orgType,
      registrationNumber: orgRegNo,
      email: orgEmail,
      phone: orgPhone,
      location: orgLocation,
      logoUrl: orgLogo,
      campsHosted: 14
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Category Selection Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 bg-rose-100/60 rounded-2xl border border-rose-200">
          <button
            type="button"
            onClick={() => setActiveCategory('citizen')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2.5 ${
              activeCategory === 'citizen'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeCategory === 'citizen' ? 'fill-white' : ''}`} />
            <span>Category 1: Citizen Login (Donor & Requester)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('organization')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2.5 ${
              activeCategory === 'organization'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Category 2: Organization / Camp Host Login</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-rose-950/5 border border-rose-100 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Visual Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#8B0000] via-[#A81313] to-[#C92A2A] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/15 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md">
              <Droplet className="w-6 h-6 fill-white" />
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
                Rakt Seva
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1 leading-tight">
                Everyone Could Be A Hero
              </h1>
              <p className="text-xs text-rose-100/90 mt-2 leading-relaxed">
                {activeCategory === 'citizen'
                  ? 'Sign in to access your dual-mode donor & emergency requester dashboard.'
                  : 'Sign in to organize institutional blood camps and coordinate with certified blood banks.'}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/15 space-y-2.5 text-xs text-rose-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{activeCategory === 'citizen' ? 'Dual-Mode Donor & Requester' : 'Host Community Blood Camps'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{activeCategory === 'citizen' ? '90-Day Cooldown & Badges' : 'Live Turnout & Pre-registrations'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{activeCategory === 'citizen' ? '5km Radius Emergency SOS' : 'Direct Hospital Transfusion Ties'}</span>
            </div>
          </div>
        </div>

        {/* Right Form Column: Category-Specific Features Only */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-5">
          {/* CATEGORY 1: CITIZEN LOGIN */}
          {activeCategory === 'citizen' && (
            <form onSubmit={submitCitizenLogin} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Citizen Login
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Required details for Citizen Donor & Requester
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200">
                  Role: Citizen
                </span>
              </div>

              {/* Photo Upload & Presets */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Profile Photo *
                  </span>
                  <label className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload from device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCitizenPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={citizenPhoto}
                      alt="Citizen"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-300 shadow-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-[11px] text-slate-500 mb-1.5 font-medium">Or choose a preset avatar:</div>
                    <div className="flex items-center gap-2">
                      {CITIZEN_PHOTO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCitizenPhoto(preset.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                            citizenPhoto === preset.url
                              ? 'border-rose-600 ring-2 ring-rose-200 scale-105'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Blood Group *
                  </label>
                  <select
                    value={citizenBloodGroup}
                    onChange={(e) => setCitizenBloodGroup(e.target.value as BloodGroup)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Email / Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  City / Location
                </label>
                <input
                  type="text"
                  value={citizenLocation}
                  onChange={(e) => setCitizenLocation(e.target.value)}
                  placeholder="e.g. Worli, Mumbai"
                  className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
                >
                  <span>Log In to Citizen Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCitizenName('Rahul Sharma');
                    setCitizenEmail('rahul.sharma@example.com');
                    setCitizenBloodGroup('O+');
                    setCitizenLocation('Worli, Mumbai');
                    setCitizenPhoto(CITIZEN_PHOTO_PRESETS[0].url);
                    onCitizenLogin({
                      id: 'CITIZEN-101',
                      name: 'Rahul Sharma',
                      email: 'rahul.sharma@example.com',
                      phone: '+91 98765 43210',
                      bloodGroup: 'O+',
                      gender: 'Male',
                      location: 'Worli, Mumbai',
                      photoUrl: CITIZEN_PHOTO_PRESETS[0].url,
                      totalDonations: 8
                    });
                  }}
                  className="w-full sm:w-auto bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 px-4 rounded-2xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-rose-600" />
                  <span>Demo Fill & Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* CATEGORY 2: ORGANIZATION / CAMP HOST LOGIN */}
          {activeCategory === 'organization' && (
            <form onSubmit={submitOrgLogin} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Organization / Camp Host Login
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Required details for NGOs, College Clubs & Corporate Hosts
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                  Role: Camp Host
                </span>
              </div>

              {/* Org Logo Upload & Presets */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Organization Logo / Seal *
                  </span>
                  <label className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload logo file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOrgLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={orgLogo}
                      alt="Org Logo"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-300 shadow-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-[11px] text-slate-500 mb-1.5 font-medium">Or choose a preset logo:</div>
                    <div className="flex items-center gap-2">
                      {ORG_LOGO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setOrgLogo(preset.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                            orgLogo === preset.url
                              ? 'border-slate-900 ring-2 ring-slate-300 scale-105'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Organization Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Rotary Club of Central Mumbai"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Organization Type *
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as any)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="NGO">Registered NGO / Rotary</option>
                    <option value="College Club / NSS">College Club / NSS Unit</option>
                    <option value="Corporate CSR">Corporate CSR Foundation</option>
                    <option value="Hospital Trust">Hospital Welfare Trust</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Registration / License ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgRegNo}
                    onChange={(e) => setOrgRegNo(e.target.value)}
                    placeholder="REG-MH-2018-8841"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Official Organization Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="contact@rotary3141.org"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={orgPassword}
                    onChange={(e) => setOrgPassword(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Headquarters / City
                  </label>
                  <input
                    type="text"
                    value={orgLocation}
                    onChange={(e) => setOrgLocation(e.target.value)}
                    placeholder="e.g. Central Mumbai"
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Log In as Camp Host</span>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrgName('Rotary Club of Central Mumbai');
                    setOrgEmail('contact@rotary3141.org');
                    setOrgRegNo('REG-MH-2018-8841');
                    setOrgLogo(ORG_LOGO_PRESETS[0].url);
                    onOrgLogin({
                      id: 'HOST-01',
                      orgName: 'Rotary Club of Central Mumbai',
                      orgType: 'NGO',
                      registrationNumber: 'REG-MH-2018-8841',
                      email: 'contact@rotary3141.org',
                      phone: '+91 98200 12345',
                      location: 'Central Mumbai',
                      logoUrl: ORG_LOGO_PRESETS[0].url,
                      campsHosted: 14
                    });
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-2xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                  <span>Demo Fill & Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
