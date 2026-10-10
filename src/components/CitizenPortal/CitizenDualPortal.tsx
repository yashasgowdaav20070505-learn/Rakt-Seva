import React, { useState } from 'react';
import { DonorRecord, BloodGroup, EmergencyBloodRequest, DonationCamp } from '../../types';
import { NearbyDonorsSection } from '../StandoutFeatures/NearbyDonorsSection';
import { DonationCampsSection } from '../StandoutFeatures/DonationCampsSection';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Award, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Droplet, 
  FileText, 
  Radio, 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Search,
  Check,
  Zap,
  Share2,
  Calendar,
  Building,
  Navigation
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../../services/i18n';

interface CitizenDualPortalProps {
  donor: DonorRecord;
  emergencyRequests: EmergencyBloodRequest[];
  camps: DonationCamp[];
  currentLanguage?: SupportedLanguage;
  citizenMode: 'donor' | 'requester';
  onChangeCitizenMode: (mode: 'donor' | 'requester') => void;
  onCreateEmergencyRequest: (req: Partial<EmergencyBloodRequest>) => void;
  onNavigateToStockSearch: () => void;
  onNavigateToCamps: () => void;
  onNavigateToMap: () => void;
  onNavigateToBloodBanks?: () => void;
  onNavigateToMapWithCamp?: (camp: DonationCamp) => void;
}

export const CitizenDualPortal: React.FC<CitizenDualPortalProps> = ({
  donor,
  emergencyRequests,
  camps,
  currentLanguage = 'en',
  citizenMode,
  onChangeCitizenMode,
  onCreateEmergencyRequest,
  onNavigateToStockSearch,
  onNavigateToCamps,
  onNavigateToMap,
  onNavigateToBloodBanks,
  onNavigateToMapWithCamp
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [isReadyToDonate, setIsReadyToDonate] = useState(true);

  // Requester Mode Form States
  const [patientName, setPatientName] = useState('');
  const [bloodGroupNeeded, setBloodGroupNeeded] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState('2');
  const [hospitalName, setHospitalName] = useState('NY Rajhansh Hospital');
  const [locationAddress, setLocationAddress] = useState('Worli Seaface, Mumbai');
  const [requesterPhone, setRequesterPhone] = useState('+91 98200 44551');
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [requestSubmittedSuccess, setRequestSubmittedSuccess] = useState(false);

  // Cooling-off calculations
  const today = new Date('2026-10-10');
  const lastDate = donor.lastDonationDate ? new Date(donor.lastDonationDate) : new Date(today.getTime() - 72 * 86400000);
  const totalCooldownDays = donor.gender === 'Female' ? 120 : 90;
  const daysElapsed = Math.max(0, Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, totalCooldownDays - daysElapsed);
  const cooldownPercent = Math.min(100, Math.round((daysElapsed / totalCooldownDays) * 100));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPrescriptionFile(fakeUrl);
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName) return;

    onCreateEmergencyRequest({
      patientName,
      bloodGroup: bloodGroupNeeded,
      unitsNeeded: Number(unitsRequired),
      hospitalName,
      location: locationAddress,
      distanceKm: 1.8,
      urgency: 'Critical',
      verificationStatus: prescriptionFile ? 'Hospital Verified' : 'Pending Verification',
      requesterPhone,
      prescriptionUrl: prescriptionFile || undefined,
      notes: 'Submitted via Citizen Emergency Portal'
    });

    setRequestSubmittedSuccess(true);
    setTimeout(() => {
      setRequestSubmittedSuccess(false);
      setPatientName('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Curved Hero: Clean "Rakt Seva" Branding */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8B0000] via-[#A81313] to-[#C92A2A] text-white p-6 sm:p-10 shadow-lg shadow-rose-950/15">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-44 h-44 rounded-full bg-black/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase text-rose-100">
            <Droplet className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
            <span>Rakt Seva · Citizen Lifeline Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {t.appName || 'Rakt Seva'}
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-normal">
            {t.tagline || 'Everyone Could Be A Hero · Saving lives, spreading smiles.'}
          </p>

          {/* Dual-Mode Toggle Switch Bar */}
          <div className="pt-2">
            <div className="inline-flex p-1.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <button
                type="button"
                onClick={() => onChangeCitizenMode('donor')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  citizenMode === 'donor'
                    ? 'bg-white text-rose-950 shadow-md scale-102'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${citizenMode === 'donor' ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{t.donorMode || 'Donor Mode'}</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeCitizenMode('requester')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  citizenMode === 'requester'
                    ? 'bg-white text-rose-950 shadow-md scale-102'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Radio className={`w-4 h-4 ${citizenMode === 'requester' ? 'text-rose-600 animate-pulse' : ''}`} />
                <span>{t.requesterMode || 'Requester Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LIFELINE ACTIONS: Mode-tailored */}
      <div className="bg-white/90 backdrop-blur-sm border border-rose-100 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            {t.quickActionsTitle || 'Quick Lifeline Services'} ({citizenMode === 'donor' ? 'Donor Services' : 'Requester Services'})
          </span>
          <span className="text-[11px] text-rose-700 font-bold">
            One-Tap Medical Grid
          </span>
        </div>

        {citizenMode === 'donor' ? (
          /* DONOR MODE ACTIONS: Find Donors is removed as it's unnecessary for donors! */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Donation Camps */}
            <button
              type="button"
              onClick={onNavigateToCamps}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.donationCamps || 'Donation Camps'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {t.donationCampsSub || 'Upcoming blood collection drives'}
                </div>
              </div>
            </button>

            {/* 2. Switch to Request Blood */}
            <button
              type="button"
              onClick={() => onChangeCitizenMode('requester')}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.emergencyRequest || 'Request Blood (Switch Mode)'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Need blood for patient
                </div>
              </div>
            </button>

            {/* 3. Blood Banks Directory */}
            <button
              type="button"
              onClick={onNavigateToMap}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-700/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.bloodBanks || 'Blood Banks Directory'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {t.bloodBanksSub || 'Certified bank centers'}
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* REQUESTER MODE ACTIONS: Includes Find Donors */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Find Donors */}
            <button
              type="button"
              onClick={onNavigateToStockSearch}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.findDonors || 'Find Donors'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Available nearby volunteers
                </div>
              </div>
            </button>

            {/* 2. Donation Camps */}
            <button
              type="button"
              onClick={onNavigateToCamps}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.donationCamps || 'Donation Camps'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Upcoming blood drives
                </div>
              </div>
            </button>

            {/* 3. Emergency Request */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('emergency-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.emergencyRequest || 'Request Blood'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Hospital emergency form
                </div>
              </div>
            </button>

            {/* 4. Blood Banks Directory */}
            <button
              type="button"
              onClick={onNavigateToMap}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF8F7] hover:bg-[#FDECEB] border border-rose-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-700/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {t.bloodBanks || 'Blood Banks'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Certified bank centers
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODE 1: DONOR MODE UI */}
      {/* ========================================================= */}
      {citizenMode === 'donor' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Availability & Cooldown Progress (7 cols) */}
            <div className="md:col-span-7 bg-white border border-rose-100/90 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Ready to Donate Availability Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F4] to-white border border-rose-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      {t.readyToDonate || 'Ready to Donate'}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isReadyToDonate && daysRemaining === 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReadyToDonate
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isReadyToDonate && daysRemaining === 0 ? 'Active on Radar' : isReadyToDonate ? 'In Cool-Down' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.readyToDonateSub || 'When ON, nearby emergency SOS requests can alert you via SMS/Push.'}
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setIsReadyToDonate(!isReadyToDonate)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out relative shrink-0 ${
                    isReadyToDonate ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle donation readiness"
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                      isReadyToDonate ? 'translate-x-6 text-rose-600' : 'translate-x-0 text-slate-400'
                    }`}
                  >
                    {isReadyToDonate ? 'ON' : 'OFF'}
                  </div>
                </button>
              </div>

              {/* Cool-Down & Eligibility Tracker */}
              <div className="space-y-3 p-4 rounded-2xl bg-white border border-rose-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-600" />
                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                      {t.cooldownTrackerTitle || 'Cool-Down & Medical Eligibility Tracker'}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      daysRemaining === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {daysRemaining === 0 ? t.eligibleNow || 'Eligible to Donate Today' : `${daysRemaining} ${t.daysRemaining || 'Days Lock Remaining'}`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-rose-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        daysRemaining === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: `${cooldownPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Last Donated: {donor.lastDonationDate || '2026-07-30'}</span>
                    <span>{daysElapsed} of {totalCooldownDays} Days Elapsed</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    National Blood Transfusion Council (NBTC) guidelines require a mandatory 90-day interval for males and 120-day interval for females to maintain hemoglobin safety.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Lifesaver Impact Scorecard (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-br from-white via-rose-50/40 to-white border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-600" />
                  <h3 className="font-black text-slate-900 text-base">
                    {t.lifesaverScorecard || 'Lifesaver Impact Scorecard'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Every donation can be separated into red cells, platelets, and plasma, helping up to three lives.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.totalDonations || 'Total Donations'}
                  </div>
                  <div className="text-3xl font-black text-rose-600 mt-1">
                    {donor.totalDonations}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Verified Camps & Centers</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.livesSaved || 'Lives Saved'}
                  </div>
                  <div className="text-3xl font-black text-emerald-600 mt-1">
                    ~{donor.totalDonations * 3}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Estimated Impact</div>
                </div>
              </div>

              {/* Citizen Hero Tier */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-black text-amber-950">Citizen Hero Level 3</div>
                    <div className="text-[10px] text-amber-800">Gold Lifesaver Badge Unlocked</div>
                  </div>
                </div>
                <span className="text-amber-800 font-black">Top 5%</span>
              </div>
            </div>
          </div>

          {/* SECOND FEATURE IN DONOR MODE: UPCOMING DONATION CAMPS LIST */}
          <DonationCampsSection
            camps={camps}
            onNavigateToMapWithCamp={onNavigateToMapWithCamp}
            currentLanguage={currentLanguage}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: REQUESTER MODE UI */}
      {/* ========================================================= */}
      {citizenMode === 'requester' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Emergency Blood Requisition Form */}
          <div id="emergency-form" className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Emergency Hospital Requisition Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                  Publish Urgent Blood Request
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Alerts verified donors in your hospital vicinity and lists active volunteers below.
                </p>
              </div>
              <span className="self-start sm:self-center text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-600 text-white">
                Priority Dispatch
              </span>
            </div>

            {requestSubmittedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in zoom-in-95">
                <div className="font-extrabold flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Emergency Request Dispatched Successfully!</span>
                </div>
                <p>
                  Nearby available donors have been notified. You can also contact the volunteers listed below directly.
                </p>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.patientName || 'Patient Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.bloodGroupNeeded || 'Blood Group Needed'} *
                  </label>
                  <select
                    value={bloodGroupNeeded}
                    onChange={(e) => setBloodGroupNeeded(e.target.value as BloodGroup)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.unitsRequired || 'Units Required (Pints)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.hospitalName || 'Hospital Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KEM Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.location || 'Hospital Location / Area'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parel, Mumbai"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    {t.requesterPhone || 'Requester Contact Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 44551"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>
              </div>

              {/* Prescription Upload */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  {t.uploadPrescription || 'Upload Doctor Prescription / Verification Document'}
                </label>
                <div className="border-2 border-dashed border-rose-200 rounded-2xl p-4 bg-[#FFFDFD] text-center hover:bg-rose-50/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="prescription-file-upload"
                  />
                  <label htmlFor="prescription-file-upload" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-rose-500 mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-slate-800">
                      {prescriptionFile ? 'File attached! Click to change' : 'Upload prescription image for "Hospital Verified" trust badge'}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Accepts JPG, PNG, PDF (Up to 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 px-6 rounded-2xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.submitRequestBtn || 'Broadcast Emergency Request'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* LIST OF NEARBY AVAILABLE DONORS */}
          <NearbyDonorsSection
            currentLanguage={currentLanguage}
            patientBloodGroup={bloodGroupNeeded}
            onNavigateToMap={onNavigateToMap}
          />
        </div>
      )}
    </div>
  );
};
