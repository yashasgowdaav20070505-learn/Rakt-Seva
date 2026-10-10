import React, { useState } from 'react';
import { DonationCamp } from '../../types';
import { Calendar, MapPin, Clock, Users, Building, CheckCircle2, Plus, Share2, Ticket, ChevronRight } from 'lucide-react';

interface CampScheduleProps {
  camps: DonationCamp[];
  onRsvpSuccess?: (campId: string) => void;
  onOpenCreateCampModal?: () => void;
}

export const CampSchedule: React.FC<CampScheduleProps> = ({ camps, onRsvpSuccess, onOpenCreateCampModal }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [rsvpModalCamp, setRsvpModalCamp] = useState<DonationCamp | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('10:00 AM - 11:00 AM');
  const [confirmedPass, setConfirmedPass] = useState<{ passId: string; camp: DonationCamp; slot: string } | null>(null);

  const handleConfirmRsvp = () => {
    if (!rsvpModalCamp || !donorName || !donorPhone) return;
    const passId = `PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedPass({
      passId,
      camp: rsvpModalCamp,
      slot: preferredSlot
    });
    onRsvpSuccess?.(rsvpModalCamp.id);
  };

  return (
    <div className="space-y-6">
      {/* Camp Schedule Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4" />
            <span>Community Outreach & Voluntary Donation Drives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Voluntary Blood Donation Camp Schedule
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Join life-saving donation camps organized by registered NGOs, Rotary & Lions clubs, youth red cross, and universities. Pre-book your time slot to bypass queues.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {onOpenCreateCampModal && (
            <button
              type="button"
              onClick={onOpenCreateCampModal}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Propose New Camp</span>
            </button>
          )}

          {/* View toggle */}
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Calendar Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Camp Listing */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {camps.map(camp => {
            const isCompleted = camp.status === 'Completed';
            const campDate = new Date(camp.date);
            const formattedDate = campDate.toLocaleDateString('en-IN', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={camp.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                  isCompleted ? 'border-slate-200 opacity-75' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center shrink-0 w-20">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        {campDate.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-extrabold text-rose-700 leading-none my-1">
                        {campDate.getDate()}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">
                        {campDate.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>

                    {/* Camp Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {camp.organizerName}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          isCompleted ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {camp.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {camp.title}
                      </h3>

                      <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{camp.venueAddress}, {camp.district}, {camp.state}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {camp.startTime} - {camp.endTime}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            Partner: {camp.partnerBloodBankName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action / Registered Donors Count */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-500">Registrations</div>
                      <div className="text-sm font-bold text-slate-800 flex items-center md:justify-end gap-1">
                        <Users className="w-3.5 h-3.5 text-rose-600" />
                        <span>{camp.registeredDonorsCount}</span>
                        <span className="text-slate-400 font-normal">/ {camp.expectedDonors} expected</span>
                      </div>
                    </div>

                    {!isCompleted ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRsvpModalCamp(camp);
                          setConfirmedPass(null);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Slot / RSVP</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Drive Concluded ({camp.collectedUnits || camp.registeredDonorsCount} units banked)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              October 2026 Scheduled Donation Camps
            </h3>
            <span className="text-xs text-slate-500">
              National Voluntary Blood Donation Month
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {camps.map(camp => (
              <div key={camp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="text-xs font-bold text-rose-700">
                  {camp.date} · {camp.startTime}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">
                  {camp.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {camp.venueAddress}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {camp.registeredDonorsCount} Donors RSVP'd
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRsvpModalCamp(camp);
                      setConfirmedPass(null);
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    RSVP →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpModalCamp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Donation Camp RSVP
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {rsvpModalCamp.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRsvpModalCamp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {confirmedPass ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    RSVP Slot Confirmed!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your digital appointment token has been reserved. Please show this at the reception desk.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Token / Pass ID:</span>
                    <span className="font-bold text-slate-900">{confirmedPass.passId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Donor Name:</span>
                    <span className="font-semibold text-slate-900">{donorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Reserved Slot:</span>
                    <span className="font-semibold text-rose-700">{confirmedPass.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Date:</span>
                    <span className="font-semibold text-slate-900">{confirmedPass.camp.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Venue:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{confirmedPass.camp.venueAddress}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRsvpModalCamp(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-rose-800">
                  <div className="font-semibold">Venue: {rsvpModalCamp.venueAddress}</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">Date: {rsvpModalCamp.date} ({rsvpModalCamp.startTime} - {rsvpModalCamp.endTime})</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone (For SMS Token)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM (Morning Slot)</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="01:30 PM - 02:30 PM">01:30 PM - 02:30 PM (Afternoon Slot)</option>
                    <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM (Evening Slot)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmRsvp}
                    disabled={!donorName || !donorPhone}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Generate E-Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpModalCamp(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
