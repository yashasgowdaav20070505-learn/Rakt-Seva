import React, { useState, useMemo } from 'react';
import { DonorRecord, DonationHistoryItem } from '../../types';
import { DigitalDonorCard } from './DigitalDonorCard';
import { DonationCertificateModal } from './DonationCertificateModal';
import { DonorPreScreeningAI } from './DonorPreScreeningAI';
import { 
  Heart, 
  Clock, 
  Award, 
  ShieldCheck, 
  Calendar, 
  IdCard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  FileText,
  UserPlus,
  ArrowRight
} from 'lucide-react';

interface DonorDashboardProps {
  donors: DonorRecord[];
  activeDonorId: string;
  onSelectDonor: (id: string) => void;
  onOpenRegisterModal: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  donors,
  activeDonorId,
  onSelectDonor,
  onOpenRegisterModal
}) => {
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [selectedCertificateItem, setSelectedCertificateItem] = useState<DonationHistoryItem | null>(null);
  const [showAiPreScreenModal, setShowAiPreScreenModal] = useState(false);

  const activeDonor = useMemo(() => {
    return donors.find(d => d.id === activeDonorId) || donors[0];
  }, [donors, activeDonorId]);

  // Automated Cooling-Off Tracker Calculations
  const coolingOffMetrics = useMemo(() => {
    if (!activeDonor || !activeDonor.lastDonationDate) {
      return {
        isEligible: true,
        daysRemaining: 0,
        daysElapsed: 0,
        totalRequiredDays: activeDonor?.gender === 'Female' ? 120 : 90,
        percentageElapsed: 100,
        nextEligibleDateStr: 'Eligible Today'
      };
    }

    const today = new Date('2026-10-10'); // Runtime simulated baseline
    const lastDate = new Date(activeDonor.lastDonationDate);
    const requiredDays = activeDonor.gender === 'Female' ? 120 : 90; // 90 days male, 120 days female

    const diffMs = today.getTime() - lastDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, requiredDays - daysElapsed);
    const percentage = Math.min(100, Math.round((daysElapsed / requiredDays) * 100));

    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + requiredDays);
    const nextDateStr = nextDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      isEligible: daysRemaining === 0,
      daysRemaining,
      daysElapsed,
      totalRequiredDays: requiredDays,
      percentageElapsed: percentage,
      nextEligibleDateStr: nextDateStr
    };
  }, [activeDonor]);

  if (!activeDonor) {
    return <div className="p-8 text-center text-slate-500">No donor profiles found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Profile Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Digital Donor Portal · Verified Donor ID</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {activeDonor.fullName}
          </h1>
          <p className="mt-1 text-slate-300 text-xs sm:text-sm">
            Card No: <span className="font-mono text-rose-300">{activeDonor.donorCardNumber}</span> · Registered in {activeDonor.district}, {activeDonor.state}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Profile Switcher */}
          <div className="bg-slate-800 p-1.5 rounded-xl flex items-center gap-2 text-xs">
            <span className="text-slate-400 pl-2">Switch Profile:</span>
            <select
              value={activeDonor.id}
              onChange={(e) => onSelectDonor(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {donors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.bloodGroup} · {d.gender})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Donor</span>
          </button>
        </div>
      </div>

      {/* Grid: Cooling-Off Tracker Gauge & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Automated Cooling-Off & Eligibility Tracker Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Automated Safety Protocol
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Donation Cooling-Off & Eligibility Tracker
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mandatory physiological rest period enforced by NBTC ({coolingOffMetrics.totalRequiredDays} days for {activeDonor.gender.toLowerCase()} donors).
                </p>
              </div>

              {coolingOffMetrics.isEligible ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eligible to Donate Today!</span>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Cooling-Off Active</span>
                </div>
              )}
            </div>

            {/* Circular / Progress Dial Visualizer */}
            <div className="mt-6 space-y-3">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {coolingOffMetrics.daysElapsed} days completed of {coolingOffMetrics.totalRequiredDays} days
                </span>
                <span className="font-bold text-rose-600">
                  {coolingOffMetrics.percentageElapsed}% Rest Elapsed
                </span>
              </div>

              {/* High contrast gauge bar */}
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    coolingOffMetrics.isEligible
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-amber-500 to-rose-600'
                  }`}
                  style={{ width: `${coolingOffMetrics.percentageElapsed}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Last Donated</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {activeDonor.lastDonationDate || 'First Time'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Next Eligible Date</div>
                  <div className="font-bold text-rose-700 mt-0.5">
                    {coolingOffMetrics.nextEligibleDateStr}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Days Remaining</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {coolingOffMetrics.daysRemaining} Days
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Hemoglobin Checked</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {activeDonor.hemoglobinGdl} g/dL (Safe)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Need to check temporary medications or recent travel?
            </span>
            <button
              type="button"
              onClick={() => setShowAiPreScreenModal(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Pre-Screen Questionnaire</span>
            </button>
          </div>
        </div>

        {/* Quick Profile Summary & Digital ID Card Launcher */}
        <div className="bg-gradient-to-br from-rose-900 to-slate-950 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider text-rose-300">
                BLOOD GROUP
              </span>
              <span className="text-[11px] text-rose-300">Verified Donor</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-4xl font-black text-white">
                {activeDonor.bloodGroup}
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-rose-100">
              <div className="flex justify-between">
                <span className="text-rose-300">Total Lifetime Donations:</span>
                <span className="font-bold text-white">{activeDonor.totalDonations} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-300">Lives Potentially Impacted:</span>
                <span className="font-bold text-amber-300">Up to {activeDonor.totalDonations * 3} Lives</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-300">Emergency SMS Alert:</span>
                <span className="font-bold text-white">{activeDonor.emergencyDonor ? 'Active' : 'Muted'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowIdCardModal(true)}
              className="w-full bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs py-2.5 rounded-xl transition-colors shadow flex items-center justify-center gap-2"
            >
              <IdCard className="w-4 h-4 text-rose-700" />
              <span>View & Print Digital Donor ID Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Past Donation History & Digital Appreciation Certificates */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Past Donation Records & Recognition
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified clinical logs across camps and medical college blood centers. Click any record to view its certified appreciation certificate.
            </p>
          </div>
        </div>

        {activeDonor.history.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-700">No past donation history logged yet</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your first voluntary donation will record your baseline vitals and generate an official Digital Certificate of Appreciation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Donation Date</th>
                  <th className="py-2.5 px-4">Center / Camp</th>
                  <th className="py-2.5 px-4">Component</th>
                  <th className="py-2.5 px-4">Volume</th>
                  <th className="py-2.5 px-4">Vitals Recorded</th>
                  <th className="py-2.5 px-4">Certificate ID</th>
                  <th className="py-2.5 px-4 text-right">Appreciation Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeDonor.history.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.donationDate}</td>
                    <td className="py-3 px-4 text-slate-800">{item.bloodBankOrCamp}</td>
                    <td className="py-3 px-4 font-medium text-rose-700">{item.component}</td>
                    <td className="py-3 px-4 text-slate-600">{item.volumeMl} mL</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      BP: {item.vitals.bp} · Hb: {item.vitals.hb}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{item.certificateId}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCertificateItem(item)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showIdCardModal && (
        <DigitalDonorCard donor={activeDonor} onClose={() => setShowIdCardModal(false)} />
      )}

      {selectedCertificateItem && (
        <DonationCertificateModal
          donor={activeDonor}
          historyItem={selectedCertificateItem}
          onClose={() => setSelectedCertificateItem(null)}
        />
      )}

      {showAiPreScreenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8">
            <DonorPreScreeningAI onClose={() => setShowAiPreScreenModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
