import React from 'react';
import { RiskLevel } from '../../types';
import { getRiskColorClass } from '../../utils/formatters';

interface RiskScoreBadgeProps {
  score: number;
  level?: RiskLevel;
  showText?: boolean;
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({
  score,
  level,
  showText = true,
}) => {
  const derivedLevel: RiskLevel =
    level || (score >= 90 ? 'CRITICAL' : score >= 75 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW');

  const colors = getRiskColorClass(derivedLevel);

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-xs font-semibold border ${colors.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${colors.dot}`} />
        {score}/100
      </span>
      {showText && (
        <span className={`text-xs font-semibold tracking-wider uppercase ${colors.text}`}>
          {derivedLevel}
        </span>
      )}
    </div>
  );
};
