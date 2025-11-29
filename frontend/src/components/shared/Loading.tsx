export const Loading = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  );
};
