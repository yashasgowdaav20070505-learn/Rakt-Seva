import React, { useState } from 'react';
import { StatutoryMetrics } from '../../types';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  Percent, 
  PieChart, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface StatutoryReportingProps {
  metrics: StatutoryMetrics;
}

export const StatutoryReporting: React.FC<StatutoryReportingProps> = ({ metrics }) => {
  const [reportState, setReportState] = useState(metrics.state || 'All India Aggregate');

  const handleExportCSV = () => {
    const csvContent = 
      `Category,Metric,Value\n` +
      `Collection,Total Units Collected,${metrics.totalUnitsCollected}\n` +
      `Collection,Voluntary Camp Drives,${metrics.campCollection}\n` +
      `Collection,Walk-in / In-House Donors,${metrics.walkinCollection}\n` +
      `Components,PRBC Produced,${metrics.prbcProduced}\n` +
      `Components,Platelet Concentrate Produced,${metrics.plateletsProduced}\n` +
      `Components,FFP Produced,${metrics.plasmaProduced}\n` +
      `Testing,Total Units Screened,${metrics.totalUnitsTested}\n` +
      `Testing,Total Seropositive Units,${metrics.seropositiveCount}\n` +
      `Testing,HIV ELISA Reactive,${metrics.seropositiveBreakdown.hiv}\n` +
      `Testing,HBsAg Hepatitis B Reactive,${metrics.seropositiveBreakdown.hbv}\n` +
      `Testing,HCV Hepatitis C Reactive,${metrics.seropositiveBreakdown.hcv}\n` +
      `Testing,Syphilis Reactive,${metrics.seropositiveBreakdown.syphilis}\n` +
      `Testing,Malaria Positive,${metrics.seropositiveBreakdown.malaria}\n` +
      `Utilization,Total Units Issued,${metrics.totalUnitsIssued}\n` +
      `Discards,Total Discarded,${metrics.totalUnitsDiscarded}\n` +
      `Discards,Expired Platelets,${metrics.discardBreakdown.expiredPlatelets}\n` +
      `Discards,Expired PRBC,${metrics.discardBreakdown.expiredPrbc}\n` +
      `Discards,Seropositive Discards,${metrics.discardBreakdown.seropositive}\n` +
      `Quality,Crossmatch-to-Transfusion Ratio,${metrics.crossmatchToTransfusionRatio}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NBTC_Form27C_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Ministry of Health & Family Welfare · Statutory Return Form 27C</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Statutory Blood Transfusion Compliance Dashboard
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Mandatory monthly audit figures under Drugs & Cosmetics Rules, 1945. Tracks componentization yield, infectious marker positivity, and clinical utilization ratios.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export CSV Return</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Form 27C</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Total Collections</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {metrics.totalUnitsCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <span>{Math.round((metrics.campCollection / metrics.totalUnitsCollected) * 100)}% Voluntary Camps</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Component Yield</div>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {((metrics.prbcProduced + metrics.plasmaProduced + metrics.plateletsProduced) / metrics.totalUnitsCollected).toFixed(2)}x
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg 2.8+ components extracted per bag
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">TTI Seropositivity</div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {((metrics.seropositiveCount / metrics.totalUnitsTested) * 100).toFixed(2)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {metrics.seropositiveCount} of {metrics.totalUnitsTested} screened
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Crossmatch Ratio (C/T)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {metrics.crossmatchToTransfusionRatio}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Optimal clinical threshold (&lt; 2.0)
          </div>
        </div>
      </div>

      {/* Detailed Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infectious Pathogen Screening Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Infectious Marker (TTI) Surveillance
              </h3>
              <span className="text-xs text-slate-500">
                Mandatory 5-Pathogen Pre-Transfusion Screen
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              100% Screened
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">HIV 1 & 2 ELISA Reactive</span>
              <span className="font-bold text-slate-900">{metrics.seropositiveBreakdown.hiv} units ({((metrics.seropositiveBreakdown.hiv/metrics.totalUnitsTested)*100).toFixed(2)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Hepatitis B (HBsAg) Reactive</span>
              <span className="font-bold text-slate-900">{metrics.seropositiveBreakdown.hbv} units ({((metrics.seropositiveBreakdown.hbv/metrics.totalUnitsTested)*100).toFixed(2)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Hepatitis C (Anti-HCV) Reactive</span>
              <span className="font-bold text-slate-900">{metrics.seropositiveBreakdown.hcv} units ({((metrics.seropositiveBreakdown.hcv/metrics.totalUnitsTested)*100).toFixed(2)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Syphilis (VDRL / RPR) Reactive</span>
              <span className="font-bold text-slate-900">{metrics.seropositiveBreakdown.syphilis} units ({((metrics.seropositiveBreakdown.syphilis/metrics.totalUnitsTested)*100).toFixed(2)}%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Malaria Parasite Positive</span>
              <span className="font-bold text-slate-900">{metrics.seropositiveBreakdown.malaria} units</span>
            </div>
          </div>
        </div>

        {/* Component Separation Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Component Separation Volumes
              </h3>
              <span className="text-xs text-slate-500">
                Blood fractionation laboratory yields
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 border border-rose-100">
              <div>
                <div className="font-bold text-rose-900">Packed Red Blood Cells (PRBC)</div>
                <div className="text-[11px] text-slate-500">Shelf life 42 days (2-6°C)</div>
              </div>
              <span className="font-extrabold text-base text-rose-700">{metrics.prbcProduced.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
              <div>
                <div className="font-bold text-amber-900">Platelet Concentrate (RDP)</div>
                <div className="text-[11px] text-slate-500">Shelf life 5 days with agitation</div>
              </div>
              <span className="font-extrabold text-base text-amber-700">{metrics.plateletsProduced.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50/50 border border-sky-100">
              <div>
                <div className="font-bold text-sky-900">Fresh Frozen Plasma (FFP)</div>
                <div className="text-[11px] text-slate-500">Shelf life 1 year (&le; -18°C)</div>
              </div>
              <span className="font-extrabold text-base text-sky-700">{metrics.plasmaProduced.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
              <div>
                <div className="font-bold text-indigo-900">Cryoprecipitate</div>
                <div className="text-[11px] text-slate-500">Factor VIII / Fibrinogen rich</div>
              </div>
              <span className="font-extrabold text-base text-indigo-700">{metrics.cryoProduced.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
