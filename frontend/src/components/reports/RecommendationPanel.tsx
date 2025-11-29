'use client';

interface RecommendationPanelProps {
  recommendations: string[];
}

export const RecommendationPanel = ({ recommendations }: RecommendationPanelProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recommendations
      </h3>
      {recommendations.length > 0 ? (
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {recommendation}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400">
          No recommendations at this time
        </p>
      )}
    </div>
  );
};
