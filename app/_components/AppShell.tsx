"use client";

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Quote,
  Users,
  Lightbulb,
  Settings,
  CreditCard,
  Key,
  Menu,
  X,
  LogOut,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { authApi } from '../_lib/api';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/queries', label: 'Queries', icon: Search },
  { href: '/dashboard/reports/visibility', label: 'Visibility', icon: TrendingUp },
  { href: '/dashboard/reports/citations', label: 'Citations', icon: Quote },
  { href: '/dashboard/reports/competitors', label: 'Competitors', icon: Users },
  { href: '/dashboard/reports/gaps', label: 'Knowledge Gaps', icon: FileText },
  { href: '/dashboard/reports/recommendations', label: 'Recommendations', icon: Lightbulb },
];

const settingsItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/team', label: 'Team', icon: Users },
  { href: '/settings/api', label: 'API', icon: Key },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Rankly</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-1">
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-40 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 mx-auto">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Rankly</span>
        </Link>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <NavContent />
      </aside>

      {/* Main content */}
      <main className="md:ml-64 p-4 md:p-6 pt-16 md:pt-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
