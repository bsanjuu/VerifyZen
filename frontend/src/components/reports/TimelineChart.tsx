'use client';

import { TimelineAnalysis } from '../../types/verification';
import { formatDuration } from '../../utils/dateUtils';

interface TimelineChartProps {
  timeline: TimelineAnalysis;
}

export const TimelineChart = ({ timeline }: TimelineChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Timeline Analysis
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Gap Duration
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatDuration(timeline.totalGapMonths)}
          </span>
        </div>

        {timeline.gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Employment Gaps
            </h4>
            <div className="space-y-2">
              {timeline.gaps.map((gap, index) => (
                <div
                  key={index}
                  className={'p-3 rounded-lg border ' + (gap.durationMonths >= 6 ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(gap.startDate).toLocaleDateString()} -{' '}
                      {new Date(gap.endDate).toLocaleDateString()}
                    </span>
                    <span className={'text-sm font-medium ' + (gap.durationMonths >= 6 ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300')}>
                      {formatDuration(gap.durationMonths)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {timeline.overlaps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Timeline Overlaps
            </h4>
            <div className="space-y-2">
              {timeline.overlaps.map((overlap, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {overlap.items.join(' & ')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(overlap.startDate).toLocaleDateString()} -{' '}
                    {new Date(overlap.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {timeline.gaps.length === 0 && timeline.overlaps.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No timeline issues detected
          </div>
        )}
      </div>
    </div>
  );
};
