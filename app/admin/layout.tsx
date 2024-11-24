'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect } from 'react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0C1F0C] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#E4A853]"></div>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/admin');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0C1F0C] flex flex-col">
      <ErrorBoundary>
        <Header />
        <main className="flex-1 pt-32">{children}</main>
        <Toaster />
      </ErrorBoundary>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
