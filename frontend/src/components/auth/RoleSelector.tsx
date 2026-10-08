import React from 'react';
import { Shield, Building2, Globe2, Cpu, Check } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

interface RoleOption {
  role: UserRole;
  label: string;
  badge: string;
  icon: React.ReactNode;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  disabled = false,
}) => {
  const roles: RoleOption[] = [
    {
      role: 'LEA',
      label: 'LEA Cyber Cell Officer',
      badge: 'State Police / QRT',
      icon: <Shield className="w-4 h-4 text-sky-400" />,
    },
    {
      role: 'BANK',
      label: 'Bank & FI Nodal Officer',
      badge: 'Fraud Risk / Lien',
      icon: <Building2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      role: 'I4C',
      label: 'I4C National Coordinator',
      badge: 'MHA Interstate Grid',
      icon: <Globe2 className="w-4 h-4 text-purple-400" />,
    },
    {
      role: 'ADMIN',
      label: 'Data Science Administrator',
      badge: 'AI ML / Ledger Audit',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Access Role
        </label>
        <span className="text-[10px] text-slate-400 font-mono">Select Persona</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {roles.map((item) => {
          const isSelected = selectedRole === item.role;
          return (
            <button
              key={item.role}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.role)}
              className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/30 text-white shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-sky-900/60 border border-sky-500/40' : 'bg-slate-800/80 border border-slate-700/60'
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium truncate">{item.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">
                  {item.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
