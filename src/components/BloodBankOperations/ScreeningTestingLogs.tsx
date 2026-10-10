import React, { useState } from 'react';
import { BloodUnit, SerologicalTestLog } from '../../types';
import { api } from '../../services/api';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Loader2,
  Filter,
  Microscope
} from 'lucide-react';

interface ScreeningTestingLogsProps {
  quarantineUnits: BloodUnit[];
  testLogs: SerologicalTestLog[];
  onTestSubmitted: () => void;
  preSelectedUnit?: BloodUnit | null;
}

export const ScreeningTestingLogs: React.FC<ScreeningTestingLogsProps> = ({
  quarantineUnits,
  testLogs,
  onTestSubmitted,
  preSelectedUnit
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    preSelectedUnit?.id || quarantineUnits[0]?.id || ''
  );
  const [hivTest, setHivTest] = useState<'Non-Reactive' | 'Reactive'>('Non-Reactive');
  const [hbvTest, setHbvTest] = useState<'Non-Reactive' | 'Reactive'>('Non-Reactive');
  const [hcvTest, setHcvTest] = useState<'Non-Reactive' | 'Reactive'>('Non-Reactive');
  const [syphilisTest, setSyphilisTest] = useState<'Non-Reactive' | 'Reactive'>('Non-Reactive');
  const [malariaTest, setMalariaTest] = useState<'Negative' | 'Positive'>('Negative');
  const [aboRhConfirmation, setAboRhConfirmation] = useState<'Confirmed Matched' | 'Discrepancy Detected'>('Confirmed Matched');
  const [irregularAntibodies, setIrregularAntibodies] = useState<'Negative' | 'Positive'>('Negative');
  const [technicianName, setTechnicianName] = useState('Anand Verma (LT-412)');
  const [supervisorName, setSupervisorName] = useState('Dr. S. K. Mukherjee');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const selectedUnit = quarantineUnits.find(u => u.id === selectedUnitId) || preSelectedUnit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const res = await api.submitScreeningTest({
        unitId: selectedUnit.id,
        bloodGroup: selectedUnit.bloodGroup,
        component: selectedUnit.component,
        testDate: new Date('2026-10-10').toISOString().split('T')[0],
        technicianName,
        supervisorName,
        hivTest,
        hbvTest,
        hcvTest,
        syphilisTest,
        malariaTest,
        aboRhConfirmation,
        irregularAntibodies,
        notes: notes || 'Standard serological ELISA panel complete.'
      });

      setFeedbackMessage(res.message);
      onTestSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Microscope className="w-4 h-4" />
            <span>Transfusion Transmissible Infections (TTI) Clearance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mandatory Serological Screening & Testing Logs
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Statutory ELISA / Chemiluminescence (CLIA) testing for HIV-1/2, HBsAg, Anti-HCV, Syphilis, and Malaria. Units remain in strict quarantine until dual-signoff laboratory verification.
          </p>
        </div>
      </div>

      {/* Main Two Columns: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lab Testing Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Laboratory Entry Desk
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Execute Serological Clearance Panel
              </h2>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-md border border-amber-200">
              {quarantineUnits.length} in Quarantine
            </span>
          </div>

          {quarantineUnits.length === 0 && !preSelectedUnit ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              No blood units currently pending serological clearance in quarantine.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Unit Selection */}
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Unit to Screen *
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {quarantineUnits.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.id} — {u.bloodGroup} {u.component} ({u.volumeMl}ml) · {u.storageLocation}
                    </option>
                  ))}
                  {preSelectedUnit && !quarantineUnits.some(u => u.id === preSelectedUnit.id) && (
                    <option value={preSelectedUnit.id}>
                      {preSelectedUnit.id} — {preSelectedUnit.bloodGroup} {preSelectedUnit.component}
                    </option>
                  )}
                </select>
              </div>

              {/* Serology Panel Tests */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
                  5-Pathogen Mandatory Infectious Marker Panel
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      1. HIV 1 & 2 (4th Gen ELISA / CLIA)
                    </label>
                    <select
                      value={hivTest}
                      onChange={(e) => setHivTest(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        hivTest === 'Non-Reactive' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Non-Reactive">Non-Reactive (Safe Negative)</option>
                      <option value="Reactive">Reactive (Positive - REJECT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      2. Hepatitis B Surface Ag (HBsAg)
                    </label>
                    <select
                      value={hbvTest}
                      onChange={(e) => setHbvTest(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        hbvTest === 'Non-Reactive' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Non-Reactive">Non-Reactive (Safe Negative)</option>
                      <option value="Reactive">Reactive (Positive - REJECT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      3. Hepatitis C Virus (Anti-HCV)
                    </label>
                    <select
                      value={hcvTest}
                      onChange={(e) => setHcvTest(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        hcvTest === 'Non-Reactive' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Non-Reactive">Non-Reactive (Safe Negative)</option>
                      <option value="Reactive">Reactive (Positive - REJECT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      4. Syphilis (VDRL / RPR / TPHA)
                    </label>
                    <select
                      value={syphilisTest}
                      onChange={(e) => setSyphilisTest(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        syphilisTest === 'Non-Reactive' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Non-Reactive">Non-Reactive (Safe Negative)</option>
                      <option value="Reactive">Reactive (Positive - REJECT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      5. Malaria Parasite (Smear / Ag)
                    </label>
                    <select
                      value={malariaTest}
                      onChange={(e) => setMalariaTest(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        malariaTest === 'Negative' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Negative">Negative (Safe)</option>
                      <option value="Positive">Positive (REJECT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      ABO & Rh Confirmation Match
                    </label>
                    <select
                      value={aboRhConfirmation}
                      onChange={(e) => setAboRhConfirmation(e.target.value as any)}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold ${
                        aboRhConfirmation === 'Confirmed Matched' ? 'bg-white text-emerald-700 border-slate-300' : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Confirmed Matched">Forward/Reverse Match Confirmed</option>
                      <option value="Discrepancy Detected">Discrepancy Detected (Hold)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Testing Lab Technician Name & ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Supervising Medical Officer *
                  </label>
                  <input
                    type="text"
                    required
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Testing Notes / Batch Instrument ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architect i2000SR Analyzer Run #4881"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {feedbackMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                  {feedbackMessage}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUnit}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating & Updating Chain of Custody...</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="w-4 h-4" />
                      <span>Submit Official Test Results & Update Unit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Historical Testing Audit Trail (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Serological Audit Logs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-verified test log records for regulatory inspection.
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {testLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{log.unitId}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                    log.finalResult === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {log.finalResult}
                  </span>
                </div>

                <div className="text-slate-600">
                  Tested: {log.testDate} · Group: <strong>{log.bloodGroup}</strong> ({log.component})
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                  <div>HIV: {log.hivTest}</div>
                  <div>HBsAg: {log.hbvTest}</div>
                  <div>HCV: {log.hcvTest}</div>
                  <div>Syphilis: {log.syphilisTest}</div>
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Tech: {log.technicianName}</span>
                  <span>Supervisor: {log.supervisorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
