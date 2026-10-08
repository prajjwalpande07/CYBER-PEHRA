import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ShieldAlert } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';

export const RiskDistributionChart: React.FC = () => {
  const { complaints } = useCyberPehra();

  const counts = {
    CRITICAL: complaints.filter((c) => c.riskLevel === 'CRITICAL').length,
    HIGH: complaints.filter((c) => c.riskLevel === 'HIGH').length,
    MEDIUM: complaints.filter((c) => c.riskLevel === 'MEDIUM').length,
    LOW: complaints.filter((c) => c.riskLevel === 'LOW').length,
  };

  const data = [
    { name: 'Critical (>90)', value: counts.CRITICAL, color: '#ef4444' },
    { name: 'High (75-89)', value: counts.HIGH, color: '#f97316' },
    { name: 'Medium (60-74)', value: counts.MEDIUM, color: '#f59e0b' },
    { name: 'Low (<60)', value: counts.LOW || 2, color: '#10b981' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-100">Risk Severity Distribution</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Stratification of active cybercrime tranches
        </p>
      </div>

      <div className="relative h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b1329" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1329',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div className="absolute top-[42%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-slate-100">{total}</span>
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Tranches</span>
        </div>
      </div>
    </div>
  );
};
