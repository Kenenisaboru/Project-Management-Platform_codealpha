'use client';

import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ActivityFeed from '@/components/ui/ActivityFeed';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="flex">
          <div className="flex-1 p-8">
            {children}
          </div>
          <aside className="hidden xl:block w-80 p-8 border-l border-white/10">
            <ActivityFeed />
          </aside>
        </div>
      </main>
    </div>
  );
}
