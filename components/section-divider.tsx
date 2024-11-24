export function SectionDivider() {
  return (
    <div className="relative py-16 bg-[#001F0F]">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#E4A853]/20"></div>
          </div>
          <div className="relative flex items-center gap-6 px-6 bg-[#001F0F]">
            <div className="w-24 h-px bg-[#E4A853]"></div>
            <div className="w-4 h-4 rotate-45 border-2 border-[#E4A853]"></div>
            <div className="w-24 h-px bg-[#E4A853]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
