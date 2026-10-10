import React, { useState } from 'react';
import { DonationCamp, BloodBank } from '../../types';
import { INDIAN_STATES } from '../../data/mockData';
import { api } from '../../services/api';
import { Calendar, Building, Users, MapPin, Phone, Loader2 } from 'lucide-react';

interface CreateCampModalProps {
  bloodBanks: BloodBank[];
  onSuccess: (newCamp: DonationCamp) => void;
  onClose: () => void;
}

export const CreateCampModal: React.FC<CreateCampModalProps> = ({
  bloodBanks,
  onSuccess,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [partnerBankId, setPartnerBankId] = useState(bloodBanks[0]?.id || 'BB-01');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Mumbai');
  const [venueAddress, setVenueAddress] = useState('');
  const [date, setDate] = useState('2026-10-18');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [expectedDonors, setExpectedDonors] = useState('150');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organizerName || !venueAddress) return;
    setIsSubmitting(true);

    const partner = bloodBanks.find(b => b.id === partnerBankId) || bloodBanks[0];

    try {
      const res = await api.createCamp({
        title,
        organizerName,
        partnerBloodBankId: partner.id,
        partnerBloodBankName: partner.name,
        state,
        district,
        venueAddress,
        date,
        startTime,
        endTime,
        contactPerson,
        contactPhone,
        expectedDonors: Number(expectedDonors)
      });
      onSuccess(res.camp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Voluntary Outreach Organizer Portal
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Propose New Blood Donation Camp
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Submit your NGO, college, or corporate donation drive to partner with accredited blood banks.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 text-base"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Camp Title / Drive Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Youth Red Cross Annual Blood Fest 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Organizing Institution / NGO *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rotary Club of Bombay West"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Partner Certified Blood Bank *
              </label>
              <select
                value={partnerBankId}
                onChange={(e) => setPartnerBankId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {bloodBanks.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Scheduled Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict(INDIAN_STATES[e.target.value]?.[0] || '');
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
                District / City
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {(INDIAN_STATES[state] || []).map(dt => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Venue Full Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Main Auditorium Hall, St. Xavier's Campus, Mahapalika Marg"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98200 11223"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expected Donors
              </label>
              <input
                type="number"
                min="20"
                max="2000"
                value={expectedDonors}
                onChange={(e) => setExpectedDonors(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2 px-5 rounded-xl shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Publish Camp to Grid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
