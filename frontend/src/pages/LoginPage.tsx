import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowDown,
  Lock,
  Building2,
  FileSpreadsheet,
  BrainCircuit,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const workflowSteps = [
    {
      title: 'Cybercrime Complaint',
      desc: 'NCRP 1930 & citizen portal telemetry ingestion',
      icon: <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />,
      tag: 'INGEST',
    },
    {
      title: 'Predictive Analytics',
      desc: 'GNN & temporal cash-out coordinate forecasting',
      icon: <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />,
      tag: 'AI MODEL',
    },
    {
      title: 'Risk Intelligence',
      desc: 'Mule syndicate mapping & ATM vulnerability scoring',
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
      tag: 'RADAR',
    },
    {
      title: 'Proactive Intervention',
      desc: 'QRT police dispatch & Sec 102 account lien freeze',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-400" />,
      tag: 'ACTION',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-between relative selection:bg-sky-500 selection:text-white">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Security Status Bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-[#090e1d]/80 backdrop-blur px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">I4C / MHA FRAMEWORK GATEWAY</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">National Cybercrime Reporting Coordination</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3 h-3 text-sky-400" />
            <span>256-BIT ENCRYPTION</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-400 font-bold text-[10px]">
            SECURE CONSOLE
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Official Branding & Workflow */}
        <section className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Government Cybercrime Intelligence Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-slate-300 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">
              Government Cybercrime Intelligence Platform
            </span>
          </div>

          {/* Logo & Headline */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 p-0.5 flex items-center justify-center shadow-xl shadow-sky-950/50">
                <ShieldAlert className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-sky-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                    CYBER PEHRA
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                    PRO
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-mono tracking-tight">
                  Predictive Intervention Grid
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Predictive intelligence for proactive cybercrime intervention.
            </p>
          </div>

          {/* Workflow Diagram */}
          <div className="space-y-2.5 max-w-xl">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Intervention Operational Pipeline</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1329]/80 border border-slate-800 shadow-xl space-y-2">
              {workflowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {step.title}
                        </div>
                        <div className="text-[11px] text-slate-400 hidden sm:block">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                      {step.tag}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="flex justify-center -my-1">
                      <ArrowDown className="w-3.5 h-3.5 text-sky-500/60" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Prototype Demonstration Environment & Authority Notice */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Prototype Demonstration Environment</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authorized Law Enforcement & Banking Desk Access</span>
            </div>
          </div>
        </section>

        {/* Right Column: Secure Login Card */}
        <section className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl relative">
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-t-2xl" />

            <LoginForm />
          </div>
        </section>
      </main>

      {/* Prototype Notice Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800 bg-[#070b14] px-4 py-4 text-center space-y-1">
        <p className="text-xs text-slate-400 font-mono">
          CYBER PEHRA PROTOTYPE — Demonstration Environment using synthetic test data.
        </p>
        <p className="text-[11px] text-slate-400">
          For Hackathon / SIH presentation only.
        </p>
      </footer>
    </div>
  );
};
