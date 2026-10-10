import React from 'react';
import { DonationHistoryItem, DonorRecord } from '../../types';
import { Award, Printer, Share2, ShieldCheck, Heart, Droplet } from 'lucide-react';

interface DonationCertificateModalProps {
  donor: DonorRecord;
  historyItem: DonationHistoryItem;
  onClose: () => void;
}

export const DonationCertificateModal: React.FC<DonationCertificateModalProps> = ({ donor, historyItem, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Official Recognition of Lifesaving Service</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Certificate Paper */}
        <div className="border-4 border-double border-rose-900/40 rounded-xl p-8 bg-gradient-to-b from-rose-50/30 via-white to-amber-50/20 text-center relative overflow-hidden">
          {/* Subtle background seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Heart className="w-96 h-96 text-rose-900" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-2 text-rose-700">
              <Droplet className="w-6 h-6 fill-rose-600 text-rose-600" />
              <span className="text-sm font-extrabold tracking-widest uppercase">
                National Blood Transfusion Council · RaktSeva
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Certificate of Appreciation
            </h2>

            <p className="text-xs text-slate-500 uppercase tracking-widest">
              This is to honor and gratefully recognize
            </p>

            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-serif font-extrabold text-rose-800 underline decoration-rose-300 decoration-1 underline-offset-8">
                {donor.fullName}
              </div>
              <div className="text-xs font-bold text-slate-600 mt-2">
                Blood Group: <span className="text-rose-700">{donor.bloodGroup}</span> · Donor Card No: {donor.donorCardNumber}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
              for generously giving the gift of life by voluntarily donating <span className="font-semibold text-rose-700">{historyItem.volumeMl} mL</span> of <span className="font-semibold text-rose-700">{historyItem.component}</span> at <span className="font-semibold text-slate-900">{historyItem.bloodBankOrCamp}</span> on <span className="font-semibold text-slate-900">{historyItem.donationDate}</span>.
            </p>

            {historyItem.recipientImpactStory && (
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-3 max-w-md mx-auto text-xs text-rose-900 italic">
                "{historyItem.recipientImpactStory}"
              </div>
            )}

            {/* Signatures & Seal */}
            <div className="pt-6 grid grid-cols-3 gap-4 items-end text-xs text-slate-600">
              <div className="border-t border-slate-300 pt-2">
                <div className="font-serif italic font-bold text-slate-800">Dr. S. K. Mukherjee</div>
                <div className="text-[10px] text-slate-500">Director, Transfusion Medicine</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-rose-700/60 flex items-center justify-center text-rose-800 text-[9px] font-bold uppercase p-1 text-center">
                  Official Seal
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">
                  {historyItem.certificateId}
                </div>
              </div>

              <div className="border-t border-slate-300 pt-2">
                <div className="font-serif italic font-bold text-slate-800">Harish V. Rao</div>
                <div className="text-[10px] text-slate-500">Voluntary Camp Registrar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
