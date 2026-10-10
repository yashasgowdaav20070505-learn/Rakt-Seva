import React, { useState, useMemo } from 'react';
import { EmergencyBloodRequest, BloodGroup } from '../../types';
import { 
  Radio, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight,
  Filter,
  Share2
} from 'lucide-react';

interface SmartSosRadiusSectionProps {
  requests: EmergencyBloodRequest[];
  onAcceptRequest: (reqId: string) => void;
}

export const SmartSosRadiusSection: React.FC<SmartSosRadiusSectionProps> = ({
  requests,
  onAcceptRequest
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(10); // 5, 10, 25, or 100 km
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [acceptedModalReq, setAcceptedModalReq] = useState<EmergencyBloodRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return requests
      .filter(req => {
        const matchRadius = req.distanceKm <= selectedRadius;
        const matchGroup = filterGroup === 'ALL' || req.bloodGroup === filterGroup;
        return matchRadius && matchGroup;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [requests, selectedRadius, filterGroup]);

  const handleRespond = (req: EmergencyBloodRequest) => {
    onAcceptRequest(req.id);
    setAcceptedModalReq(req);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse text-rose-600" />
            <span>Geo-Targeted Rapid Response · Smart Radius Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Active Emergency SOS Blood Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time critical requirements sorted by distance. Respond to local emergencies within minutes.
          </p>
        </div>

        {/* Radius Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-rose-100 shadow-xs self-start md:self-center">
          <span className="text-[11px] font-bold text-slate-400 pl-2">Radius:</span>
          {[5, 10, 25, 50].map(km => (
            <button
              key={km}
              type="button"
              onClick={() => setSelectedRadius(km)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRadius === km
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &lt; {km} km
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid inspired by the visual mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="col-span-2 p-10 text-center bg-white rounded-3xl border border-rose-100 space-y-2">
            <Heart className="w-10 h-10 text-rose-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No active emergency requests within {selectedRadius} km
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Expand your search radius or check back soon. Your availability remains active in the local donor grid!
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isCritical = req.urgency === 'Critical';
            const isVerified = req.verificationStatus === 'Hospital Verified';

            return (
              <div
                key={req.id}
                className="bg-white border border-rose-100 hover:border-rose-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-700" />

                <div className="space-y-3">
                  {/* Top Bar: Hospital Name + Urgent Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {req.hospitalName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-rose-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          <span>Within {req.distanceKm} km</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{req.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="bg-[#B91C1C] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs shadow-rose-950/20">
                        {req.urgency}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {req.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Middle Info Row: Blood Group & Verification Badge */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Blood Type Needed:
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                        <span className="text-rose-700 font-black text-base">{req.bloodGroup}</span>
                        <span className="text-slate-400 font-normal ml-1.5">
                          ({req.unitsNeeded} units needed)
                        </span>
                      </div>
                    </div>

                    {/* Fake-Request Prevention Indicator Badge */}
                    <div className="flex items-center gap-1.5">
                      {isVerified ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="leading-none text-[11px]">Hospital Verified</div>
                            <div className="text-[9px] text-emerald-600 font-medium">Reg # {req.verifiedHospitalId || 'MH-881'}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <div>
                            <div className="leading-none text-[11px]">Pending Desk Verification</div>
                            <div className="text-[9px] text-amber-600 font-medium">Reviewing prescription</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Patient Note */}
                  {req.notes && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      "{req.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-rose-600" />
                    <span><strong>{req.respondersCount} donors</strong> responding</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${req.requesterPhone}`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Call Attendant"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRespond(req)}
                      className={`text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
                        req.acceptedByMe
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{req.acceptedByMe ? 'Responding ✓' : 'Accept / Respond'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Response Confirmation Modal */}
      {acceptedModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
              <Heart className="w-8 h-8 fill-rose-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Thank You for Responding!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your emergency donor token has been assigned to <strong className="text-slate-900">{acceptedModalReq.patientName}</strong> at <strong className="text-slate-900">{acceptedModalReq.hospitalName}</strong>.
              </p>
            </div>

            <div className="bg-[#FFF9F8] border border-rose-100 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital Desk Phone:</span>
                <span className="font-bold text-rose-700">{acceptedModalReq.requesterPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{acceptedModalReq.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Distance from you:</span>
                <span className="font-semibold text-slate-800">{acceptedModalReq.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <span className="font-bold text-emerald-700">{acceptedModalReq.verificationStatus}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAcceptedModalReq(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition-all"
            >
              Close & View Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
