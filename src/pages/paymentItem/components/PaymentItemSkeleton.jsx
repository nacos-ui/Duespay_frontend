export default function PaymentItemSkeleton() {
  return (
    <div className="bg-[#23263A] rounded-lg p-5 shadow-md relative animate-pulse">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
        <div className="h-6 w-16 bg-gray-700 rounded"></div>
      </div>
      <div className="flex gap-2 mb-1">
        <div className="h-5 w-16 bg-gray-700 rounded"></div>
        <div className="h-5 w-16 bg-gray-700 rounded"></div>
      </div>
      <div className="h-3 w-1/3 bg-gray-700 rounded mb-4"></div>
      <div className="flex gap-3 justify-end">
        <div className="h-4 w-4 bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}