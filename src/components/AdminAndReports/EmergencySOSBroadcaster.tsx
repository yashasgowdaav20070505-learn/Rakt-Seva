import React, { useState } from 'react';
import { BloodGroup, DonorRecord } from '../../types';
import { INDIAN_STATES } from '../../data/mockData';
import { api } from '../../services/api';
import { 
  Radio, 
  Send, 
  Smartphone, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  Bell,
  Clock,
  Sparkles
} from 'lucide-react';

interface EmergencySOSBroadcasterProps {
  donors: DonorRecord[];
  onBroadcastSuccess: () => void;
}

export const EmergencySOSBroadcaster: React.FC<EmergencySOSBroadcasterProps> = ({
  donors,
  onBroadcastSuccess
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [selectedState, setSelectedState] = useState('Delhi (NCT)');
  const [selectedDistrict, setSelectedDistrict] = useState('New Delhi');
  const [urgencyLevel, setUrgencyLevel] = useState<'CRITICAL_EMERGENCY' | 'HIGH_SHORTAGE'>('CRITICAL_EMERGENCY');
  const [unitsNeeded, setUnitsNeeded] = useState('3');
  const [hospitalName, setHospitalName] = useState('AIIMS Trauma Care Centre, New Delhi');
  const [contactHelpline, setContactHelpline] = useState('1800-11-2446');
  const [customMessage, setCustomMessage] = useState('');
  
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<any | null>(null);

  // Calculate matching eligible donors
  const matchingDonors = donors.filter(d => {
    const groupMatch = d.bloodGroup === selectedGroup;
    return groupMatch;
  });

  const previewSmsText = customMessage || 
    `[RAKTSEVA SOS ALERT] Urgent ${selectedGroup} blood required at ${hospitalName} (${unitsNeeded} units needed immediately). As an eligible voluntary donor in ${selectedDistrict}, your donation can save a life today. Helpline: ${contactHelpline}. Reply YES to confirm slot.`;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await api.broadcastEmergencySos({
        title: `EMERGENCY SOS: ${selectedGroup} Required Immediately`,
        message: previewSmsText,
        bloodGroupNeeded: selectedGroup,
        district: selectedDistrict
      });

      setBroadcastResult(res);
      onBroadcastSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcaster Header */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-4 h-4 animate-pulse text-rose-400" />
            <span>Emergency Rapid Response · Targeted SMS & Push Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Emergency Shortage & SOS Donor Broadcaster
          </h1>
          <p className="mt-2 text-rose-100/90 text-sm leading-relaxed">
            Trigger automated emergency broadcast alerts across verified voluntary donors. The system identifies matching blood phenotypes within the target district who have fulfilled their mandatory cooling-off period.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Emergency Dispatch Console
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Draft Urgent Blood Request
            </h2>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Blood Group Required *
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value as BloodGroup)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Units Needed Urgently
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target State / UT
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict(INDIAN_STATES[e.target.value]?.[0] || '');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {Object.keys(INDIAN_STATES).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target District / City
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {(INDIAN_STATES[selectedState] || []).map(dt => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hospital / Transfusion Center Name *
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Helpline Phone *
              </label>
              <input
                type="text"
                required
                value={contactHelpline}
                onChange={(e) => setContactHelpline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isBroadcasting}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isBroadcasting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting SMS Gateway to Registered Donors...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Emergency SOS Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {broadcastResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Emergency Broadcast Dispatched Successfully!</span>
              </div>
              <div>{broadcastResult.message}</div>
              <div className="text-[11px] text-emerald-700">
                Simulated Gateway: Sent to {broadcastResult.simulatedSmsSent} mobile recipients via National SMS Gateway.
              </div>
            </div>
          )}
        </div>

        {/* Live Smartphone Notification Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Donor Mobile Preview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              How the simulated SMS / Push Notification appears on local donors' smartphones.
            </p>
          </div>

          {/* Smartphone Mockup */}
          <div className="max-w-[280px] mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-xl border-4 border-slate-800">
            {/* Speaker & notch */}
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
            
            <div className="bg-slate-100 rounded-[1.8rem] p-3 min-h-[380px] flex flex-col justify-between text-slate-900">
              <div className="space-y-3">
                <div className="text-center text-[10px] text-slate-400 font-semibold pt-1">
                  Friday, October 10 · 09:41 AM
                </div>

                {/* Notification Bubble */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200/80 space-y-1.5 animate-bounce-short">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-rose-700 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-rose-600" />
                      <span>RAKTSEVA SOS</span>
                    </span>
                    <span className="text-slate-400 text-[9px]">now</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-900">
                    CRITICAL: {selectedGroup} Needed Immediately
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed font-sans">
                    {previewSmsText}
                  </p>
                  <div className="pt-1.5 flex gap-1.5">
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      I Can Donate
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded">
                      Share with Friends
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 py-1">
                Slide up to unlock
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
