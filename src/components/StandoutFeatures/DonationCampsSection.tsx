import React, { useState } from 'react';
import { DonationCamp } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Building2, 
  Users, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ExternalLink,
  Navigation,
  Share2,
  HeartHandshake
} from 'lucide-react';

interface DonationCampsSectionProps {
  camps: DonationCamp[];
  onNavigateToMapWithCamp?: (camp: DonationCamp) => void;
  currentLanguage?: string;
}

export const DonationCampsSection: React.FC<DonationCampsSectionProps> = ({
  camps,
  onNavigateToMapWithCamp
}) => {
  const [registeredCampIds, setRegisteredCampIds] = useState<Record<string, boolean>>({});
  const [activeDistrictFilter, setActiveDistrictFilter] = useState<'ALL' | string>('ALL');

  const handleRegister = (campId: string) => {
    setRegisteredCampIds(prev => ({
      ...prev,
      [campId]: true
    }));
  };

  const filteredCamps = camps.filter(camp => {
    if (activeDistrictFilter === 'ALL') return true;
    return camp.district === activeDistrictFilter;
  });

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span>Community Blood Drives & Outreach</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Upcoming Blood Donation Camps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Join scheduled voluntary blood collection camps organized by verified hospitals and partner NGOs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-600">Filter:</span>
          <button
            type="button"
            onClick={() => setActiveDistrictFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeDistrictFilter === 'ALL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            All Areas ({camps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveDistrictFilter('Mumbai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeDistrictFilter === 'Mumbai'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Mumbai
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCamps.map((camp) => {
          const isRegistered = !!registeredCampIds[camp.id];

          return (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F8] to-white border border-rose-100 hover:border-rose-200 transition-all flex flex-col justify-between space-y-4 hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {camp.organizerName}
                    </span>
                    <h3 className="font-black text-slate-900 text-base leading-snug">
                      {camp.title}
                    </h3>
                  </div>

                  <span className="text-xs font-black text-rose-700 bg-white border border-rose-200 px-2.5 py-1 rounded-xl shrink-0 shadow-2xs">
                    {camp.distanceKm ? `${camp.distanceKm} km away` : 'Nearby'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{camp.venueAddress}</span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span className="font-bold">{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{camp.startTime} - {camp.endTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Partner Bank: <strong>{camp.partnerBloodBankName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Expected Turnout: <strong>{camp.expectedDonors} donors</strong> ({camp.registeredDonorsCount} registered)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-rose-100/60 flex items-center gap-2.5">
                {onNavigateToMapWithCamp && (
                  <button
                    type="button"
                    onClick={() => onNavigateToMapWithCamp(camp)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-rose-600" />
                    <span>View on Google Map</span>
                  </button>
                )}

                {isRegistered ? (
                  <div className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>RSVP Confirmed</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRegister(camp.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Pre-Register Slot</span>
                  </button>
                )}

                <a
                  href={`tel:${camp.contactPhone}`}
                  title="Call camp coordinator"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
