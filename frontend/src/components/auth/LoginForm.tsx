import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { UserRole } from '../../types';
import { RoleSelector } from './RoleSelector';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setCurrentRole } = useCyberPehra();

  // Saved credentials or default
  const savedId = localStorage.getItem('cyberpehra_saved_id') || '';
  const wasRemembered = localStorage.getItem('cyberpehra_remember') === 'true';

  const [officerId, setOfficerId] = useState<string>(savedId || 'demo@cyberpehra.gov.in');
  const [password, setPassword] = useState<string>('CyberPehra@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('LEA');
  const [rememberDevice, setRememberDevice] = useState<boolean>(wasRemembered);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = () => {
    setOfficerId('demo@cyberpehra.gov.in');
    setPassword('CyberPehra@123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!officerId.trim()) {
      setErrorMessage('Please enter your Officer ID or email.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(officerId, password, selectedRole, rememberDevice);

      if (!result.success) {
        setErrorMessage(result.error || 'Invalid Officer ID or password.');
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSuccess(true);
      setCurrentRole(selectedRole);

      // Brief transition before navigating to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 450);
    } catch {
      setErrorMessage('Invalid Officer ID or password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>Secure Access</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <ShieldCheck className="w-3 h-3" />
            GOV-SEC
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sign in to access the CYBER PEHRA Intervention Grid
        </p>
      </div>

      {/* Demo Credentials Quick-Fill helper */}
      <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <KeyRound className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span className="font-mono text-[11px]">
            Demo: <strong className="text-sky-300">demo@cyberpehra.gov.in</strong> / <strong className="text-sky-300">CyberPehra@123</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-medium text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Auto-fill
        </button>
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Officer ID / Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Officer ID / Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              autoComplete="username"
              value={officerId}
              disabled={isSubmitting || isSuccess}
              onChange={(e) => {
                setOfficerId(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. demo@cyberpehra.gov.in"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              disabled={isSubmitting || isSuccess}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition-colors disabled:opacity-50 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting || isSuccess}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <RoleSelector
          selectedRole={selectedRole}
          onChange={(role) => setSelectedRole(role)}
          disabled={isSubmitting || isSuccess}
        />

        {/* Remember device checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberDevice}
              disabled={isSubmitting || isSuccess}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500/30 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-300">Remember this device</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono">Secured Session</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            isSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-900/30'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30'
          } ${isSubmitting || isSuccess ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Access granted</span>
            </>
          ) : (
            <span>SIGN IN</span>
          )}
        </button>
      </form>

      {/* Footer notice below button */}
      <div className="pt-2 text-center border-t border-slate-800">
        <p className="text-[11px] text-slate-400 font-mono">
          Prototype environment — Demonstration data only
        </p>
      </div>
    </div>
  );
};
