import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

export const ComplaintTrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const dailyData = [
    { period: '00:00', complaints: 4, intercepted: 3, highRisk: 2 },
    { period: '03:00', complaints: 2, intercepted: 2, highRisk: 1 },
    { period: '06:00', complaints: 7, intercepted: 5, highRisk: 4 },
    { period: '09:00', complaints: 18, intercepted: 14, highRisk: 12 },
    { period: '12:00', complaints: 26, intercepted: 22, highRisk: 19 },
    { period: '15:00', complaints: 21, intercepted: 17, highRisk: 15 },
    { period: '18:00', complaints: 15, intercepted: 12, highRisk: 9 },
    { period: '21:00', complaints: 11, intercepted: 8, highRisk: 6 },
  ];

  const weeklyData = [
    { period: 'Mon', complaints: 88, intercepted: 72, highRisk: 54 },
    { period: 'Tue', complaints: 96, intercepted: 81, highRisk: 62 },
    { period: 'Wed', complaints: 124, intercepted: 104, highRisk: 86 },
    { period: 'Thu', complaints: 110, intercepted: 92, highRisk: 74 },
    { period: 'Fri', complaints: 138, intercepted: 115, highRisk: 98 },
    { period: 'Sat', complaints: 145, intercepted: 118, highRisk: 104 },
    { period: 'Sun', complaints: 92, intercepted: 76, highRisk: 58 },
  ];

  const monthlyData = [
    { period: 'Apr', complaints: 2420, intercepted: 1940, highRisk: 1480 },
    { period: 'May', complaints: 2780, intercepted: 2260, highRisk: 1720 },
    { period: 'Jun', complaints: 3120, intercepted: 2600, highRisk: 1990 },
    { period: 'Jul', complaints: 3640, intercepted: 3080, highRisk: 2380 },
    { period: 'Aug', complaints: 4190, intercepted: 3610, highRisk: 2850 },
    { period: 'Sep (MTD)', complaints: 3820, intercepted: 3340, highRisk: 2640 },
  ];

  const data = timeRange === 'daily' ? dailyData : timeRange === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Cybercrime Complaint Velocity & Interventions
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time complaint inflow vs. proactive ATM/account interventions
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTimeRange(mode)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                timeRange === mode
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorIntercepted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1329',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Area
              type="monotone"
              dataKey="complaints"
              name="Total Complaints"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorComplaints)"
            />
            <Area
              type="monotone"
              dataKey="intercepted"
              name="Prevented / Intercepted"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIntercepted)"
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              name="High-Risk Flagged"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHighRisk)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
