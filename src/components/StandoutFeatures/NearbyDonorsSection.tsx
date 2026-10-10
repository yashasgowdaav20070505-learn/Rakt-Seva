import React, { useState } from 'react';
import { MOCK_NEARBY_DONORS, NearbyDonor } from '../../data/mockNearbyDonors';
import { BloodGroup } from '../../types';
import { 
  Users, 
  MapPin, 
  Phone, 
  Send, 
  ShieldCheck, 
  Clock, 
  Heart, 
  CheckCircle2, 
  Droplet, 
  Filter, 
  Search,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';
import { TRANSLATIONS, SupportedLanguage } from '../../services/i18n';

interface NearbyDonorsSectionProps {
  currentLanguage?: SupportedLanguage;
  patientBloodGroup?: BloodGroup;
  onSelectDonorForMap?: (donor: NearbyDonor) => void;
  onNavigateToMap?: () => void;
}

export const NearbyDonorsSection: React.FC<NearbyDonorsSectionProps> = ({
  currentLanguage = 'en',
  patientBloodGroup = 'O+',
  onSelectDonorForMap,
  onNavigateToMap
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('ALL');
  const [searchLocation, setSearchLocation] = useState<string>('Worli, Mumbai');
  const [requestedDonorIds, setRequestedDonorIds] = useState<Set<string>>(new Set());
  const [activeRequestedDonor, setActiveRequestedDonor] = useState<NearbyDonor | null>(null);

  const filteredDonors = MOCK_NEARBY_DONORS.filter(d => {
    const matchesRadius = d.distanceKm <= selectedRadius;
    const matchesGroup = filterBloodGroup === 'ALL' || d.bloodGroup === filterBloodGroup;
    return matchesRadius && matchesGroup;
  });

  const handleSendRequest = (donor: NearbyDonor) => {
    setRequestedDonorIds(prev => new Set(prev).add(donor.id));
    setActiveRequestedDonor(donor);
    setTimeout(() => {
      setActiveRequestedDonor(null);
    }, 3500);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-black uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>{t.nearbyDonorsTitle || 'Nearby Available Donors'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.nearbyDonorsSub || 'Direct contact with verified volunteers ready within your selected radius'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with verified citizens in your vicinity who have confirmed availability.
          </p>
        </div>

        {/* View on Map Shortcut */}
        {onNavigateToMap && (
          <button
            type="button"
            onClick={onNavigateToMap}
            className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm shadow-rose-600/30 transition-all shrink-0"
          >
            <MapPin className="w-4 h-4" />
            <span>View on Realistic Google Map</span>
          </button>
        )}
      </div>

      {/* Filter Bar: Radius, Blood Group, Location */}
      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Radius Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Search Radius Distance:
          </label>
          <div className="flex items-center gap-1.5">
            {[2, 5, 10, 20].map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => setSelectedRadius(radius)}
                className={`flex-1 py-1.5 px-2 rounded-xl font-extrabold transition-all ${
                  selectedRadius === radius
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 text-slate-700 hover:bg-rose-100'
                }`}
              >
                {radius} km
              </button>
            ))}
          </div>
        </div>

        {/* Blood Group Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Target Blood Group:
          </label>
          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
            className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="ALL">All Compatible Groups ({filteredDonors.length} found)</option>
            {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map(bg => (
              <option key={bg} value={bg}>Group {bg}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Your Emergency Location:
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="e.g. Worli, Mumbai"
              className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl pl-8 pr-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Success Banner if request sent */}
      {activeRequestedDonor && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-extrabold">Emergency Request Sent to {activeRequestedDonor.fullName}!</span>
              <div className="text-[11px] text-emerald-700">
                SMS alert and app dispatch dispatched with your patient details. Expected response within {activeRequestedDonor.responseTime}.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded-full shrink-0">
            Dispatched
          </span>
        </div>
      )}

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDonors.map((donor) => {
          const isRequested = requestedDonorIds.has(donor.id);
          const isUniversal = donor.bloodGroup === 'O-';
          const isExact = donor.bloodGroup === patientBloodGroup;

          return (
            <div
              key={donor.id}
              className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group"
            >
              {/* Distance badge & compatibility */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={donor.photoUrl}
                      alt={donor.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-200 shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active & Ready to Donate" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-sm leading-tight">
                        {donor.fullName}
                      </h3>
                      {donor.verification.aadhaarVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200" title="Aadhaar UIDAI Verified">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Aadhaar Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{donor.location}</span>
                      <span className="font-bold text-rose-700">({donor.distanceKm} km away)</span>
                    </div>
                  </div>
                </div>

                {/* Blood Group Plaque */}
                <div className="text-right shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#C92A2A] text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[9px] uppercase font-bold text-rose-200 leading-none">Group</span>
                    <span className="text-base font-black leading-none">{donor.bloodGroup}</span>
                  </div>
                  {isUniversal ? (
                    <span className="block text-[9px] font-bold text-amber-700 mt-1">Universal O-</span>
                  ) : isExact ? (
                    <span className="block text-[9px] font-bold text-emerald-700 mt-1">Exact Match</span>
                  ) : null}
                </div>
              </div>

              {/* Stats & Responsiveness Pill */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 text-[11px]">
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">Total Donations</div>
                  <div className="font-black text-slate-800">{donor.totalDonations} Times</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">Response Time</div>
                  <div className="font-black text-emerald-700">{donor.responseTime}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">Status</div>
                  <div className="font-black text-rose-700">Ready to Donate</div>
                </div>
              </div>

              {/* Action Buttons: Call & Send Request */}
              <div className="flex items-center gap-2 pt-1">
                {/* Direct Call Button */}
                <a
                  href={`tel:${donor.phone}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call {donor.phone}</span>
                </a>

                {/* Send Blood Request Button */}
                <button
                  type="button"
                  disabled={isRequested}
                  onClick={() => handleSendRequest(donor)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    isRequested
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  }`}
                >
                  {isRequested ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Request Dispatched</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.sendRequestBtn || 'Send Blood Request'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDonors.length === 0 && (
        <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div className="font-bold text-slate-900">No active donors found in {selectedRadius} km for group {filterBloodGroup}</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your search radius to 20 km or switching to "All Compatible Groups" to see nearby donors ready to respond.
          </p>
          <button
            type="button"
            onClick={() => { setSelectedRadius(20); setFilterBloodGroup('ALL'); }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            Expand to 20 km & All Groups
          </button>
        </div>
      )}
    </div>
  );
};
