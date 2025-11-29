'use client';

import { formatRiskScore } from '../../utils/formatters';

interface RiskScoreCardProps {
  score: number;
}

export const RiskScoreCard = ({ score }: RiskScoreCardProps) => {
  const { label, color, bgColor } = formatRiskScore(score);

  return (
    <div className={'rounded-lg p-6 ' + bgColor}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Risk Score
      </h3>
      <div className="flex items-end space-x-4">
        <div className={'text-5xl font-bold ' + color}>{score}</div>
        <div className="text-gray-600 dark:text-gray-400 pb-2">/ 100</div>
      </div>
      <div className={'mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium ' + color + ' ' + bgColor}>
        {label}
      </div>
      <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={'h-full transition-all duration-500 ' + (score >= 75 ? 'bg-red-600' : score >= 50 ? 'bg-orange-600' : score >= 25 ? 'bg-yellow-600' : 'bg-green-600')}
          style={{ width: score + '%' }}
        />
      </div>
    </div>
  );
};
