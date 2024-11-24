export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C1F0C]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#E4A853] mb-4">
          Page Not Found
        </h1>
        <p className="text-white/80">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to view it.
        </p>
      </div>
    </div>
  );
}
