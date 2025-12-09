"use client";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90  z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-primary font-medium text-sm">Loading...</p>
      </div>
    </div>
  );
}
