import React, { useState } from 'react';
import { BloodUnit } from '../../types';
import { api } from '../../services/api';
import { ShieldCheck, Send, Loader2, Hospital, User, FileText } from 'lucide-react';

interface RequisitionModalProps {
  unit: BloodUnit;
  onSuccess: () => void;
  onClose: () => void;
}

export const RequisitionModal: React.FC<RequisitionModalProps> = ({
  unit,
  onSuccess,
  onClose
}) => {
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [attendingDoctor, setAttendingDoctor] = useState('');
  const [urgencyReason, setUrgencyReason] = useState('Emergency Surgery / Trauma');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName) return;
    setIsSubmitting(true);

    try {
      await api.updateUnitStatus(unit.id, {
        status: 'Reserved',
        issuedTo: {
          patientName,
          hospitalName,
          issueDate: new Date('2026-10-10').toISOString().split('T')[0],
          requisitionId: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`
        }
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Emergency Clinical Requisition
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Reserve Unit {unit.id}
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Blood Group: <strong className="text-rose-700">{unit.bloodGroup}</strong> · Component: {unit.component} ({unit.volumeMl}ml)
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Chandra"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Admitting Hospital / Clinical Ward *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Civil District Hospital, ICU Ward 4"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Attending Surgeon / Physician
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. K. N. Joshi (MS Surgery)"
              value={attendingDoctor}
              onChange={(e) => setAttendingDoctor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Indication
            </label>
            <select
              value={urgencyReason}
              onChange={(e) => setUrgencyReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Emergency Surgery / Trauma">Emergency Surgery / Trauma</option>
              <option value="Acute Hemorrhage / Post-Partum (PPH)">Acute Hemorrhage / Post-Partum (PPH)</option>
              <option value="Severe Dengue Thrombocytopenia">Severe Dengue Thrombocytopenia</option>
              <option value="Thalassemia Major Transfusion">Thalassemia Major Transfusion</option>
              <option value="Oncology / Chemotherapy Support">Oncology / Chemotherapy Support</option>
            </select>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800">
            Reserving locks this unit in the central grid for 2 hours while crossmatch confirmation and hospital courier dispatch is organized.
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
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2 px-5 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Confirm 2-Hour Reservation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
