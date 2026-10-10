import React, { useState } from 'react';
import { DonorAchievementBadge, DonorRecord } from '../../types';
import { MOCK_DONOR_BADGES } from '../../data/mockData';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Download, 
  Printer, 
  Share2, 
  Heart, 
  Droplet,
  CheckCircle2,
  X
} from 'lucide-react';

interface BadgeCertificateViewerProps {
  donor: DonorRecord;
  badges?: DonorAchievementBadge[];
  onClose?: () => void;
}

export const BadgeCertificateViewer: React.FC<BadgeCertificateViewerProps> = ({
  donor,
  badges = MOCK_DONOR_BADGES,
  onClose
}) => {
  const [selectedBadge, setSelectedBadge] = useState<DonorAchievementBadge>(badges[0]);

  const handlePrint = () => {
    window.print();
  };

  const getTierColor = (tier: DonorAchievementBadge['tier']) => {
    switch (tier) {
      case 'Platinum': return 'from-slate-700 to-slate-900 text-slate-100 border-slate-600';
      case 'Gold': return 'from-amber-600 to-amber-800 text-amber-100 border-amber-500';
      case 'Silver': return 'from-slate-400 to-slate-600 text-slate-100 border-slate-300';
      case 'Bronze': default: return 'from-rose-700 to-rose-900 text-rose-100 border-rose-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-rose-100 pb-4 no-print">
          <div>
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>National Voluntary Honor System</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Digital "Lifesaver" Certificate & Badge Vault
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Awarded to <strong className="text-slate-800">{donor.fullName}</strong> ({donor.bloodGroup}) for selfless humanitarian service.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Badges Grid (Horizontally scrollable / grid) */}
        <div className="space-y-2 no-print">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Earned Achievement Badges:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {badges.map(badge => {
              const isSelected = selectedBadge.id === badge.id;
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setSelectedBadge(badge)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-300 shadow-sm'
                      : badge.isUnlocked
                      ? 'border-rose-100 bg-white hover:bg-rose-50/50'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTierColor(badge.tier)} flex items-center justify-center text-white shadow-sm mb-2`}>
                    {badge.isUnlocked ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] font-black text-slate-900 leading-tight">
                      {badge.title}
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 block mt-0.5">
                      {badge.tier}
                    </span>
                  </div>

                  <span className="text-[9px] text-slate-400 mt-1">
                    {badge.isUnlocked ? badge.earnedDate : 'Locked'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Badge Spotlight Certificate Showcase */}
        <div className="border-4 border-double border-rose-900/30 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#FFFDFD] via-white to-[#FFF6F5] text-center relative overflow-hidden shadow-inner">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-rose-900" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#8B0000] to-[#C92A2A] text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-950/20 border-2 border-rose-400/40">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-rose-700">
                OFFICIAL NATIONAL LIFESAVER MERIT BADGE
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {selectedBadge.title}
              </h3>
              <p className="text-xs font-semibold text-rose-800 mt-0.5">
                {selectedBadge.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="py-2 inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-xs text-slate-500">Conferred Upon:</span>
              <span className="text-sm font-extrabold text-slate-900">{donor.fullName}</span>
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Group {donor.bloodGroup}
              </span>
            </div>

            <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-500 max-w-md mx-auto">
              <span>Status: <strong className="text-emerald-700">Verified Lifesaver</strong></span>
              <span>Awarded: <strong>{selectedBadge.earnedDate}</strong></span>
              <span>Tier: <strong>{selectedBadge.tier} Medal</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 no-print">
          <div className="text-xs text-slate-500">
            Shareable on LinkedIn, Social Media, and Medical Portals.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-5 rounded-2xl transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print Award</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-2xl"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
