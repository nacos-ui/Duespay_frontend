export default function SettingsCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
          <div className="h-6 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="w-5 h-5 bg-gray-700 rounded"></div>
      </div>
      
      {/* Content lines */}
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="h-4 w-16 bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-700 rounded ml-2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-20 bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-700 rounded ml-2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-12 bg-gray-700 rounded"></div>
          <div className="h-4 w-28 bg-gray-700 rounded ml-2"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-18 bg-gray-700 rounded"></div>
          <div className="h-4 w-36 bg-gray-700 rounded ml-2"></div>
        </div>
      </div>
    </div>
  );
}