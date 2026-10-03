'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminStatsProvider } from '@/components/admin/AdminStatsContext';
import { ShieldAlert, ArrowLeft, LogOut, ShoppingBag } from 'lucide-react';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Check session & verify admin role
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        const data = await res.json();
        setCurrentUser(data.user);

        if (!data.isAdmin) {
          // Normal customer logged in and attempted to access /admin
          setAccessDenied(true);
          setCheckingAuth(false);
        } else {
          setAccessDenied(false);
          setCheckingAuth(false);
        }
      } catch {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader-spinner" />
        <span className="admin-loader-text">Verifying MK Silver Hub credentials...</span>
        <style jsx>{`
          .admin-loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            background-color: #F8F7F3;
          }
          .admin-loader-spinner {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid #E8E7E2;
            border-top-color: #111111;
            animation: spin 0.8s linear infinite;
          }
          .admin-loader-text {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.86rem;
            color: #6F6F6A;
            font-weight: 500;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Access Denied Barrier for Normal Customers
  if (accessDenied) {
    return (
      <div className="access-denied-screen">
        <div className="denied-card">
          <div className="denied-icon-wrap">
            <ShieldAlert size={34} className="text-[#111111]" />
          </div>
          <h1 className="denied-title">Administrator Access Required</h1>
          <p className="denied-desc">
            You are currently authenticated as <strong>{currentUser?.email}</strong> with customer privileges.
            Access to the MK Silver Hub administrative control center is restricted to authorized personnel.
          </p>

          <div className="denied-actions">
            <Link href="/account" className="btn-primary">
              <ShoppingBag size={16} />
              <span>Go to Customer Portal</span>
            </Link>
            <Link href="/" className="btn-secondary">
              <ArrowLeft size={16} />
              <span>Return to Store</span>
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              <LogOut size={16} />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>

        <style jsx>{`
          .access-denied-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F8F7F3;
            padding: 20px;
          }
          .denied-card {
            max-width: 480px;
            background: #FFFFFF;
            border: 1px solid #E8E7E2;
            border-radius: 12px;
            padding: 36px 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          }
          .denied-icon-wrap {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background-color: #F2F0EA;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 18px;
          }
          .denied-title {
            font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
            font-size: 1.7rem;
            color: #111111;
            margin-bottom: 8px;
          }
          .denied-desc {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.86rem;
            color: #6F6F6A;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .denied-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .btn-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: #111111;
            color: #FFFFFF;
            padding: 10px;
            border-radius: 6px;
            font-size: 0.86rem;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.18s ease;
          }
          .btn-primary:hover {
            background-color: #252525;
          }
          .btn-secondary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: #FFFFFF;
            color: #111111;
            border: 1px solid #E8E7E2;
            padding: 10px;
            border-radius: 6px;
            font-size: 0.86rem;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.18s ease;
          }
          .btn-secondary:hover {
            background-color: #F8F7F3;
          }
          .btn-danger {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: none;
            border: 1px solid transparent;
            color: #C0392B;
            padding: 8px;
            border-radius: 6px;
            font-size: 0.82rem;
            cursor: pointer;
            margin-top: 2px;
            transition: background 0.18s ease;
          }
          .btn-danger:hover {
            background-color: #FDF0EE;
          }
        `}</style>
      </div>
    );
  }

  return (
    <AdminStatsProvider>
      <div className="admin-root-layout">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Top Header */}
        <AdminHeader
          collapsed={collapsed}
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        {/* Main Content Area */}
        <main className={`admin-main-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
    </AdminStatsProvider>
  );
}
