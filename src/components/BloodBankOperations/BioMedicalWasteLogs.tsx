import React, { useState } from 'react';
import { BioMedicalWasteRecord, BloodGroup, ComponentType } from '../../types';
import { api } from '../../services/api';
import { 
  Trash2, 
  ShieldAlert, 
  FileCheck, 
  Printer, 
  Plus, 
  Building, 
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

interface BioMedicalWasteLogsProps {
  wasteRecords: BioMedicalWasteRecord[];
  onWasteRecordAdded: () => void;
}

export const BioMedicalWasteLogs: React.FC<BioMedicalWasteLogsProps> = ({
  wasteRecords,
  onWasteRecordAdded
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [unitId, setUnitId] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [component, setComponent] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');
  const [volumeMl, setVolumeMl] = useState('450');
  const [reason, setReason] = useState<BioMedicalWasteRecord['reason']>('Expired Shelf Life');
  const [treatmentMethod, setTreatmentMethod] = useState<BioMedicalWasteRecord['treatmentMethod']>('Autoclaving & Shredding (Yellow Bag)');
  const [authorizedOfficer, setAuthorizedOfficer] = useState('Dr. Anita Roy (Medical Officer in Charge)');
  const [wasteContractor, setWasteContractor] = useState('Synergy Waste Management Pvt Ltd');
  const [notes, setNotes] = useState('');

  const [activeCertificate, setActiveCertificate] = useState<BioMedicalWasteRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logWasteRecord({
        unitId: unitId || `RS-2026-MAN-${Math.floor(100 + Math.random() * 900)}`,
        bloodGroup,
        component,
        volumeMl: Number(volumeMl),
        disposalDate: new Date('2026-10-10').toISOString().split('T')[0],
        reason,
        treatmentMethod,
        authorizedOfficer,
        wasteContractor,
        manifestNumber: `BMW-DL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: notes || 'Bio-medical waste statutory protocol followed.'
      });
      setShowAddModal(false);
      onWasteRecordAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Waste Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trash2 className="w-4 h-4" />
            <span>Statutory Environmental Compliance · Bio-Medical Waste (BMW) Rules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bio-Medical Waste Tracking & Discard Audit
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Complete compliance trail for authorized destruction of seropositive, expired, or hemolyzed blood bags under Yellow Bag categories with authorized PCB manifest tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Safe Disposal Batch</span>
        </button>
      </div>

      {/* Discard Audit Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900">
            Certified Discard Log ({wasteRecords.length} batches logged)
          </div>
          <span className="text-[11px] text-slate-500">
            CPCB / State Pollution Control Board Manifest Certified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Batch ID</th>
                <th className="py-2.5 px-4">Unit ID</th>
                <th className="py-2.5 px-4">Blood Group</th>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Reason for Discard</th>
                <th className="py-2.5 px-4">Treatment Method</th>
                <th className="py-2.5 px-4">Authorized Officer</th>
                <th className="py-2.5 px-4">Disposal Date</th>
                <th className="py-2.5 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wasteRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {rec.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {rec.unitId}
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-700">
                    {rec.bloodGroup}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {rec.component}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      rec.reason.includes('Reactive') 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.reason}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {rec.treatmentMethod}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {rec.authorizedOfficer}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {rec.disposalDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveCertificate(rec)}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline"
                    >
                      Audit Slip →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Waste Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Bio-Medical Waste Desk
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Record Safe Discard & Decontamination
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Unit ID / Barcode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RS-2026-B901"
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Component Type
                  </label>
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value as ComponentType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                    <option value="Platelet Concentrate">Platelet Concentrate</option>
                    <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                    <option value="Whole Blood">Whole Blood</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Reason for Discard *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Expired Shelf Life">Expired Past Shelf Life</option>
                    <option value="Reactive Test Result">Reactive Serological Screening</option>
                    <option value="Bag Leakage / Clot">Bag Leakage or Clot Present</option>
                    <option value="Hemolysis">Gross Hemolysis Observed</option>
                    <option value="Low Volume Collection">Underfill / Low Volume Collection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment / Decontamination Method *
                </label>
                <select
                  value={treatmentMethod}
                  onChange={(e) => setTreatmentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Autoclaving & Shredding (Yellow Bag)">Autoclaving & Shredding (Yellow Bag Category)</option>
                  <option value="Chemical Disinfection 1% Hypochlorite">Chemical Disinfection (1% Sodium Hypochlorite)</option>
                  <option value="Incineration Handover">Handover for High-Temperature Incineration</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Authorized Medical Officer
                  </label>
                  <input
                    type="text"
                    value={authorizedOfficer}
                    onChange={(e) => setAuthorizedOfficer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Bio-Waste Disposal Vendor
                  </label>
                  <input
                    type="text"
                    value={wasteContractor}
                    onChange={(e) => setWasteContractor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-5 rounded-xl shadow-sm"
                >
                  Confirm Disposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Waste Audit Slip Modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-xs">
            <div className="flex items-start justify-between no-print">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Pollution Control Board Form IV
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Bio-Medical Waste Handover Manifest
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="border border-slate-300 rounded-xl p-5 bg-slate-50 space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-sans font-bold text-slate-900">
                <span>Manifest Number:</span>
                <span className="text-rose-700">{activeCertificate.manifestNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Batch Reference:</span>
                <span>{activeCertificate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Unit Barcode:</span>
                <span>{activeCertificate.unitId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Blood Group & Component:</span>
                <span>{activeCertificate.bloodGroup} · {activeCertificate.component}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Disposal Category / Reason:</span>
                <span className="text-rose-700 font-bold">{activeCertificate.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Treatment Standard:</span>
                <span>{activeCertificate.treatmentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Disposal Date:</span>
                <span>{activeCertificate.disposalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Authorized Officer:</span>
                <span>{activeCertificate.authorizedOfficer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Authorized Vendor:</span>
                <span>{activeCertificate.wasteContractor}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Audit Manifest</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
