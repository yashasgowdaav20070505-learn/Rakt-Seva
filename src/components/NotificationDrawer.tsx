import React from 'react';
import { NotificationAlert } from '../types';
import { Bell, X, AlertTriangle, Radio, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface NotificationDrawerProps {
  notifications: NotificationAlert[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNotification?: (notif: NotificationAlert) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold">Emergency & System Alerts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active alerts or emergency broadcasts.
            </div>
          ) : (
            notifications.map(notif => {
              const isSos = notif.type === 'urgent_sos';
              const isFifo = notif.type === 'fifo_warning';
              const isCamp = notif.type === 'camp_invite';

              return (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification?.(notif)}
                  className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all cursor-pointer ${
                    isSos
                      ? 'bg-rose-50/70 border-rose-200 hover:bg-rose-50'
                      : isFifo
                      ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      {isSos && <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
                      {isFifo && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      {isCamp && <Calendar className="w-3.5 h-3.5 text-sky-600" />}
                      <span className={isSos ? 'text-rose-900' : isFifo ? 'text-amber-900' : 'text-slate-900'}>
                        {notif.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {notif.smsRecipientCount && (
                      <span className="text-rose-700 font-semibold">
                        Dispatched to {notif.smsRecipientCount} Local Donors
                      </span>
                    )}
                    {notif.bloodGroupNeeded && (
                      <span className="font-mono font-bold text-rose-800">
                        Target Group: {notif.bloodGroupNeeded}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 text-center text-[11px] text-slate-400 bg-slate-50 shrink-0">
          Connected to State Blood Transfusion Rapid Alert Grid
        </div>
      </div>
    </div>
  );
};
