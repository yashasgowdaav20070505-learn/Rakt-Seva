import React, { useRef } from 'react';
import { DonorRecord } from '../../types';
import { Droplet, QrCode, Shield, Download, Printer, Phone, Calendar, Heart, Award } from 'lucide-react';

interface DigitalDonorCardProps {
  donor: DonorRecord;
  onClose?: () => void;
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({ donor, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between no-print">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              National Blood Transfusion Grid
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Digital Donor Identity Card
            </h3>
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

        {/* The Printable Digital Card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900 via-rose-800 to-slate-950 text-white p-6 shadow-xl border border-rose-700/50"
        >
          {/* Holographic Watermark Pattern */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
          <div className="absolute right-4 top-4 opacity-10">
            <Droplet className="w-32 h-32 text-white" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between relative z-10 border-b border-rose-700/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/30 border border-rose-400 flex items-center justify-center text-white">
                <Droplet className="w-5 h-5 fill-rose-400 text-rose-400" />
              </div>
              <div>
                <div className="text-xs font-extrabold tracking-wider uppercase text-rose-200">
                  RaktSeva · LifeStream
                </div>
                <div className="text-[10px] text-rose-300">
                  Voluntary Blood Donor Card
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/70 border border-rose-700/60 text-rose-200">
                {donor.donorCardNumber}
              </span>
            </div>
          </div>

          {/* Body Info */}
          <div className="mt-4 grid grid-cols-3 gap-3 relative z-10">
            <div className="col-span-2 space-y-2">
              <div>
                <div className="text-[10px] text-rose-300 font-medium">Donor Name</div>
                <div className="text-lg font-extrabold text-white tracking-tight">
                  {donor.fullName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-rose-300">Date of Birth</div>
                  <div className="font-semibold text-rose-100">{donor.dateOfBirth}</div>
                </div>
                <div>
                  <div className="text-[10px] text-rose-300">Gender</div>
                  <div className="font-semibold text-rose-100">{donor.gender}</div>
                </div>
                <div>
                  <div className="text-[10px] text-rose-300">Weight & Hb</div>
                  <div className="font-semibold text-rose-100">{donor.weightKg} kg · {donor.hemoglobinGdl} g/dL</div>
                </div>
                <div>
                  <div className="text-[10px] text-rose-300">Total Donations</div>
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{donor.totalDonations} Units</span>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-rose-200/90 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-rose-400" />
                <span>Emergency: {donor.phone}</span>
              </div>
            </div>

            {/* Right: Blood Group Hologram Badge & QR */}
            <div className="flex flex-col items-center justify-between border-l border-rose-700/40 pl-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-white to-rose-100 text-rose-900 flex flex-col items-center justify-center shadow-lg border-2 border-rose-300">
                <span className="text-[9px] font-bold tracking-widest uppercase text-rose-700">GROUP</span>
                <span className="text-2xl font-black text-rose-700 leading-none">{donor.bloodGroup}</span>
              </div>

              {/* Simulated QR Code for Quick Camp Check-in */}
              <div className="w-14 h-14 bg-white p-1 rounded-lg shadow mt-2 flex items-center justify-center text-slate-900">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-4 pt-3 border-t border-rose-700/50 flex items-center justify-between text-[10px] text-rose-300/80">
            <span>Verified by NBTC / State Transfusion Council</span>
            <span>Emergency Volunteer: {donor.emergencyDonor ? 'YES' : 'NO'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 no-print">
          <div className="text-xs text-slate-500">
            Scan QR code at any registered blood bank to pull medical history.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
