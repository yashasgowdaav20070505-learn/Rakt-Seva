import React, { useState } from 'react';
import { DonationCamp, BloodBank, CampHostRecord } from '../../types';
import { MOCK_CAMP_HOST_ORGS, INDIAN_STATES } from '../../data/mockData';
import { 
  Building, 
  Calendar, 
  Users, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Award,
  Download,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';

interface CampHostPortalProps {
  camps: DonationCamp[];
  bloodBanks: BloodBank[];
  onCreateCamp: (camp: Partial<DonationCamp>) => void;
}

export const CampHostPortal: React.FC<CampHostPortalProps> = ({
  camps,
  bloodBanks,
  onCreateCamp
}) => {
  const [selectedHostId, setSelectedHostId] = useState<string>(MOCK_CAMP_HOST_ORGS[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [campName, setCampName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [campDate, setCampDate] = useState('2026-10-24');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endTime, setEndTime] = useState('04:30 PM');
  const [expectedTurnout, setExpectedTurnout] = useState('200');
  const [partnerBankId, setPartnerBankId] = useState(bloodBanks[0]?.id || 'BB-01');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Mumbai');
  const [contactName, setContactName] = useState('Harish Mehta (President)');
  const [contactPhone, setContactPhone] = useState('+91 98200 12345');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const activeHost = MOCK_CAMP_HOST_ORGS.find(h => h.id === selectedHostId) || MOCK_CAMP_HOST_ORGS[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !venueAddress) return;

    const partner = bloodBanks.find(b => b.id === partnerBankId) || bloodBanks[0];

    onCreateCamp({
      title: campName,
      organizerName: activeHost.orgName,
      partnerBloodBankId: partner.id,
      partnerBloodBankName: partner.name,
      state: selectedState,
      district: selectedDistrict,
      venueAddress,
      date: campDate,
      startTime,
      endTime,
      contactPerson: contactName,
      contactPhone,
      expectedDonors: Number(expectedTurnout),
      status: 'Upcoming'
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowCreateModal(false);
      setCampName('');
      setVenueAddress('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building className="w-4 h-4" />
            <span>Community Outreach Network · Authorized Camp Host Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Organization & Camp Host Dashboard
          </h1>
          <p className="mt-1 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Coordinated management for NGOs, university clubs, and corporate CSR entities partnering with state-certified blood transfusion centers.
          </p>
        </div>

        {/* Host Profile Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700 text-xs flex items-center gap-2">
            <span className="text-slate-400 pl-2">Logged in as:</span>
            <select
              value={selectedHostId}
              onChange={(e) => setSelectedHostId(e.target.value)}
              className="bg-slate-900 text-white font-bold rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {MOCK_CAMP_HOST_ORGS.map(org => (
                <option key={org.id} value={org.id}>
                  {org.orgName} ({org.orgType})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Host New Camp</span>
          </button>
        </div>
      </div>

      {/* Host Organization KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Total Camps Hosted</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {activeHost.campsHostedCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            100% Regulatory Cleared
          </div>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Donors Mobilized</div>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {activeHost.totalDonorsMobilized.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Voluntary attendance
          </div>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Units Successfully Banked</div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {Math.round(activeHost.totalDonorsMobilized * 0.92).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Avg 92% collection yield
          </div>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Institution Status</div>
          <div className="text-sm font-bold text-emerald-800 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accredited Host Partner</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Contact: {activeHost.contactPerson}
          </div>
        </div>
      </div>

      {/* Upcoming & Managed Camps Section */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Outreach Schedule
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Hosted Community Camps Roster
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Real-time pre-registration tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F8] text-slate-500 font-semibold border-b border-rose-100">
              <tr>
                <th className="py-3 px-4">Camp Name</th>
                <th className="py-3 px-4">Venue & City</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Partner Blood Bank</th>
                <th className="py-3 px-4">Pre-Registrations</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Roster Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {camps.map(camp => {
                const isCompleted = camp.status === 'Completed';
                const statusBadge = isCompleted 
                  ? 'bg-slate-100 text-slate-700' 
                  : camp.status === 'Ongoing' 
                  ? 'bg-emerald-100 text-emerald-800 font-bold animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200';

                return (
                  <tr key={camp.id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {camp.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{camp.venueAddress}, {camp.district}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {camp.date} ({camp.startTime})
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {camp.partnerBloodBankName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Users className="w-3.5 h-3.5 text-rose-600" />
                        <span>{camp.registeredDonorsCount}</span>
                        <span className="text-slate-400 font-normal">/ {camp.expectedDonors} capacity</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {camp.status === 'Upcoming' ? 'Active / Approved' : camp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Downloaded Attendee Roster for ${camp.title} (${camp.registeredDonorsCount} registered donors).`)}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Passes</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Host New Camp Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Partner Drive Intake
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Host New Voluntary Blood Donation Camp
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Organizing entity: <strong className="text-slate-800">{activeHost.orgName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-base"
              >
                ✕
              </button>
            </div>

            {formSubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">Camp Scheduled Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  Published to the National Voluntary Grid. Pre-registration links are now live.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Camp Name / Drive Theme *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LifeStream Corporate Heroes Drive 2026"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Venue Full Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hall A, Manyata Tech Park, Nagawara, Bengaluru"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Target State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedDistrict(INDIAN_STATES[e.target.value]?.[0] || '');
                      }}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {Object.keys(INDIAN_STATES).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      District / City
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {(INDIAN_STATES[selectedState] || []).map(dt => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={campDate}
                      onChange={(e) => setCampDate(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Expected Turnout
                    </label>
                    <input
                      type="number"
                      value={expectedTurnout}
                      onChange={(e) => setExpectedTurnout(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Partner Blood Bank
                    </label>
                    <select
                      value={partnerBankId}
                      onChange={(e) => setPartnerBankId(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {bloodBanks.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-rose-600/30 transition-all"
                  >
                    Publish Hosted Camp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
