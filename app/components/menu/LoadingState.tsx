'use client';

export const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <div className="space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4E45] mx-auto"></div>
      <p className="text-[#2A4E45] font-medium">Loading...</p>
    </div>
  </div>
);
