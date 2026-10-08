import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldAlert, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';

export const NotificationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toasts, markToastRead, clearAllToasts } = useCyberPehra();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = toasts.filter((t) => !t.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-sky-500/50 text-slate-300 hover:text-white transition-colors"
        title="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0b1329] border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                Command Alerts & Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-400 font-mono font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {toasts.length > 0 && (
                <button
                  onClick={clearAllToasts}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {toasts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                No active notifications
              </div>
            ) : (
              toasts.map((toast) => (
                <div
                  key={toast.id}
                  onClick={() => markToastRead(toast.id)}
                  className={`p-3 text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                    toast.read ? 'bg-slate-900/40 opacity-75' : 'bg-slate-850 hover:bg-slate-800/90'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{getIcon(toast.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-xs">{toast.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{toast.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{toast.message}</p>
                  </div>
                  {!toast.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markToastRead(toast.id);
                      }}
                      className="text-slate-500 hover:text-sky-400"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-800 bg-[#090e1d] text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              Live Gateway Sync • I4C CFCFRMS Switch
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
