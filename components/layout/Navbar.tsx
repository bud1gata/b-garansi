"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full mb-6 relative shadow-sm dark:border-b dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform transition hover:scale-105">
          Warranty Tracker
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/items/new" className="text-sm font-medium px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                + Add Asset
              </Link>
              <div className="flex items-center gap-3 ml-2 border-l pl-4 border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:inline-block">
                  {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
