'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Settings', href: '/settings' },
];

export default function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-white">
      <aside className="hidden w-64 border-r border-gray-200 bg-white md:block">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">Rankly</h1>
        </div>
        <nav className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-gray-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex w-full flex-col md:hidden">
        <div className="flex h-14 items-center border-b border-gray-200 bg-white px-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded p-2 hover:bg-gray-100"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold">Rankly</h1>
          <div className="w-10" />
        </div>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 top-14 bg-black/20"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="absolute left-0 top-14 w-64 space-y-2 border-r border-gray-200 bg-white p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <hr className="my-4 border-gray-200" />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </>
        )}
      </div>

      <main className="flex-1 overflow-auto bg-gray-50 md:ml-0">
        {children}
      </main>
    </div>
  );
}