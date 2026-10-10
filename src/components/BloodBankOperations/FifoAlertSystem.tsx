import React, { useMemo } from 'react';
import { BloodUnit } from '../../types';
import { 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Droplet,
  Layers
} from 'lucide-react';

interface FifoAlertSystemProps {
  units: BloodUnit[];
  onDispatchUnit?: (unit: BloodUnit) => void;
}

export const FifoAlertSystem: React.FC<FifoAlertSystemProps> = ({ units, onDispatchUnit }) => {
  const today = new Date('2026-10-10');

  // Filter only cleared units for FIFO dispatch analysis
  const clearedUnits = useMemo(() => {
    return units.filter(u => u.status === 'Cleared');
  }, [units]);

  // Calculate days remaining and categorize
  const analyzedUnits = useMemo(() => {
    return clearedUnits.map(unit => {
      const expiry = new Date(unit.expiryDate);
      const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let urgency: 'critical' | 'warning' | 'safe' = 'safe';
      
      if (unit.component.includes('Platelet')) {
        if (daysLeft <= 1) urgency = 'critical';
        else if (daysLeft <= 2) urgency = 'warning';
        else urgency = 'safe';
      } else if (unit.component.includes('PRBC') || unit.component.includes('Whole')) {
        if (daysLeft <= 3) urgency = 'critical';
        else if (daysLeft <= 7) urgency = 'warning';
        else urgency = 'safe';
      } else {
        // Plasma
        if (daysLeft <= 14) urgency = 'warning';
        else urgency = 'safe';
      }

      return {
        ...unit,
        daysLeft,
        urgency
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [clearedUnits]);

  const criticalUnits = analyzedUnits.filter(u => u.urgency === 'critical');
  const warningUnits = analyzedUnits.filter(u => u.urgency === 'warning');
  const safeUnits = analyzedUnits.filter(u => u.urgency === 'safe');

  return (
    <div className="space-y-6">
      {/* FIFO Header */}
      <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" />
            <span>Zero-Waste Cold Chain · Automated FIFO Warning Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            First-In, First-Out (FIFO) Alert System
          </h1>
          <p className="mt-2 text-amber-100/90 text-sm leading-relaxed">
            Automated intelligence flagging units closest to expiration viability thresholds. Prioritizes platelet stocks (5-day viability) and mature PRBC units for emergency allocations to minimize bio-medical waste.
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="mt-6 pt-5 border-t border-rose-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-rose-900/40 border border-rose-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Critical Urgency (&le; 24-72h)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {criticalUnits.length} Units
            </div>
            <div className="text-[11px] text-rose-200 mt-0.5">
              Requires immediate dispatch requisition
            </div>
          </div>

          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Approaching Window (&le; 2-7d)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {warningUnits.length} Units
            </div>
            <div className="text-[11px] text-amber-200 mt-0.5">
              Prioritize for scheduled surgeries
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe Buffer (&gt; 7d / Plasma)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {safeUnits.length} Units
            </div>
            <div className="text-[11px] text-emerald-200 mt-0.5">
              Stable cold-storage reserves
            </div>
          </div>
        </div>
      </div>

      {/* Critical FIFO Dispatch Queue */}
      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Immediate FIFO Dispatch Queue ({criticalUnits.length} Units)
            </h2>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            Priority Action Required
          </span>
        </div>

        {criticalUnits.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
            No units currently in critical expiry threshold. Excellent cold-chain circulation!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalUnits.map(unit => (
              <div
                key={unit.id}
                className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-rose-700">
                      {unit.bloodGroup}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {unit.id}
                    </span>
                    <span className="text-xs bg-rose-200/60 text-rose-900 px-2 py-0.5 rounded font-semibold">
                      {unit.daysLeft === 1 ? '1 Day Left!' : `${unit.daysLeft} Days Left`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-semibold mt-1">
                    {unit.component} · {unit.volumeMl} mL
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Location: {unit.storageLocation} ({unit.bloodBankName})
                  </div>
                  <div className="text-[11px] text-rose-700 font-medium mt-0.5">
                    Expiry Date: {unit.expiryDate}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDispatchUnit?.(unit)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Prioritize Dispatch</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning & Active FIFO Stream Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900">
            Full Automated FIFO Queue (Ordered by Expiry)
          </div>
          <span className="text-xs text-slate-500">
            Showing all screened active units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">FIFO Rank</th>
                <th className="py-2.5 px-4">Unit ID</th>
                <th className="py-2.5 px-4">Blood Group</th>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Shelf-Life Days Left</th>
                <th className="py-2.5 px-4">Expiry Date</th>
                <th className="py-2.5 px-4">Storage Location</th>
                <th className="py-2.5 px-4">Urgency Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analyzedUnits.map((unit, index) => (
                <tr key={unit.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-500">
                    #{index + 1}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {unit.id}
                  </td>
                  <td className="py-3 px-4 font-black text-rose-700">
                    {unit.bloodGroup}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {unit.component}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span className={
                      unit.urgency === 'critical' ? 'text-rose-600' :
                      unit.urgency === 'warning' ? 'text-amber-600' : 'text-slate-700'
                    }>
                      {unit.daysLeft} Days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {unit.expiryDate}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {unit.storageLocation}
                  </td>
                  <td className="py-3 px-4">
                    {unit.urgency === 'critical' && (
                      <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                        Critical FIFO
                      </span>
                    )}
                    {unit.urgency === 'warning' && (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                        Expiring Soon
                      </span>
                    )}
                    {unit.urgency === 'safe' && (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[10px] uppercase">
                        Safe Shelf Life
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDispatchUnit?.(unit)}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline"
                    >
                      Allocate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
