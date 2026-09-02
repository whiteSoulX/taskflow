'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout, isAuthenticated, getMe } from '@/lib/auth';
import { LayoutDashboard, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const router = useRouter();
  const authed = typeof window !== 'undefined' && isAuthenticated();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    getMe()
      .then((data) => {
        if (!cancelled) setUsername(data.username);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <LayoutDashboard className="text-cyan-400" size={22} />
          Task<span className="text-cyan-400">Flow</span>
        </Link>
        <div className="flex items-center gap-4">
          {authed ? (
            <>
              {username && (
                <span className="hidden sm:inline text-slate-400 text-sm">
                  Hi, <span className="text-slate-200 font-medium">{username}</span>
                </span>
              )}
              <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm">
                Dashboard
              </Link>
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-slate-300 hover:text-red-400"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white text-sm">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-cyan-400 text-slate-900 font-medium px-4 py-2 rounded-lg text-sm hover:bg-cyan-300 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
