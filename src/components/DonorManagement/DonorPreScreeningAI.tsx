import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, CheckCircle2, AlertTriangle, Clock, Activity, Loader2, ArrowRight } from 'lucide-react';

interface DonorPreScreeningAIProps {
  onEligibleConfirmed?: () => void;
  onClose?: () => void;
}

export const DonorPreScreeningAI: React.FC<DonorPreScreeningAIProps> = ({ onEligibleConfirmed, onClose }) => {
  const [age, setAge] = useState('28');
  const [weight, setWeight] = useState('68');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [hemoglobin, setHemoglobin] = useState('14.2');
  const [lastDonationMonths, setLastDonationMonths] = useState('4');
  const [hadTattooIn6Months, setHadTattooIn6Months] = useState(false);
  const [recentDentalOrSurgery, setRecentDentalOrSurgery] = useState(false);
  const [medications, setMedications] = useState('');
  const [feverOrInfection, setFeverOrInfection] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const evaluation = await api.preScreenDonor({
        age: Number(age),
        weight: Number(weight),
        gender,
        hemoglobin: Number(hemoglobin),
        lastDonationMonths: Number(lastDonationMonths),
        hadTattooIn6Months,
        recentDentalOrSurgery,
        medications,
        feverOrInfection
      });
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Gemini Clinical Triage · Low-Latency Evaluator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Instant Donor Pre-Screening & Eligibility Check
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate your physical and deferral status against NBTC regulatory criteria before visiting a donation camp.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              min="16"
              max="75"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <span className="text-[10px] text-slate-400">Standard: 18 - 65 yrs</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Weight (Kg)
            </label>
            <input
              type="number"
              min="35"
              max="150"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <span className="text-[10px] text-slate-400">Min 45 kg (350ml) / 50 kg</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Male">Male (90d cooling-off)</option>
              <option value="Female">Female (120d cooling-off)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={hemoglobin}
              onChange={(e) => setHemoglobin(e.target.value)}
              placeholder="e.g. 13.5 (or leave blank if unsure)"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <span className="text-[10px] text-slate-400">Cutoff: &gt;= 12.5 g/dL</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Months Since Last Blood Donation
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={lastDonationMonths}
              onChange={(e) => setLastDonationMonths(e.target.value)}
              placeholder="0 for first time donor"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <span className="text-[10px] text-slate-400">3 mos for men, 4 mos for women</span>
          </div>
        </div>

        {/* Checkbox Toggles */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={hadTattooIn6Months}
              onChange={(e) => setHadTattooIn6Months(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Have you had a tattoo or body piercing within the last 6 months?</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={recentDentalOrSurgery}
              onChange={(e) => setRecentDentalOrSurgery(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Recent tooth extraction (past 72 hours) or major surgery (past 6 months)?</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={feverOrInfection}
              onChange={(e) => setFeverOrInfection(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Fever, severe cold, cough, sore throat, or malaria symptoms in the last 14 days?</span>
          </label>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Current Regular Medications (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Paracetamol, BP medications, Aspirin (or leave blank if none)"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Clinical Rules...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Eligibility Now</span>
            </>
          )}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div className={`p-5 rounded-xl border transition-all ${
          result.eligible 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {result.eligible ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold">
                  {result.verdictTitle || (result.eligible ? 'Preliminary Eligible to Donate' : 'Temporary Deferral Required')}
                </h3>
                <span className="text-xs opacity-75">
                  Algorithm Confidence Score: {result.confidenceScore || 95}%
                </span>
              </div>
            </div>

            {result.coolingOffDaysRemaining > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-200 text-amber-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{result.coolingOffDaysRemaining} Days Wait</span>
              </span>
            )}
          </div>

          <p className="text-xs mt-3 leading-relaxed">
            {result.summary}
          </p>

          {result.reasons && result.reasons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200/60">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                Deferral Factors Identified:
              </span>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {result.reasons.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-200/60">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                Pre-Donation Guidelines:
              </span>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {result.eligible && onEligibleConfirmed && (
            <div className="mt-4 pt-3 border-t border-emerald-200 flex justify-end">
              <button
                type="button"
                onClick={onEligibleConfirmed}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Proceed to Book Camp Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
