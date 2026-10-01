'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
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
            background-color: #FFF9F3;
          }
          .admin-loader-spinner {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 3px solid #E8D8D0;
            border-top-color: #B76E79;
            animation: spin 0.8s linear infinite;
          }
          .admin-loader-text {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.9rem;
            color: #806D68;
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
            <ShieldAlert size={36} className="text-[#B76E79]" />
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
            background-color: #FAF5F0;
            padding: 20px;
          }
          .denied-card {
            max-width: 480px;
            background: #FFFFFF;
            border: 1px solid #EADFD5;
            border-radius: 24px;
            padding: 40px 32px;
            text-align: center;
            box-shadow: 0 16px 40px rgba(52, 39, 39, 0.08);
          }
          .denied-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: #FCE8DE;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .denied-title {
            font-family: var(--font-display), 'Cormorant Garamond', Georgia, serif;
            font-size: 1.8rem;
            color: #342727;
            margin-bottom: 10px;
          }
          .denied-desc {
            font-family: var(--font-ui), 'Jost', sans-serif;
            font-size: 0.88rem;
            color: #7D6B66;
            line-height: 1.6;
            margin-bottom: 28px;
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
            background-color: #B76E79;
            color: #FFFFFF;
            padding: 12px;
            border-radius: 12px;
            font-size: 0.88rem;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.2s ease;
          }
          .btn-primary:hover {
            background-color: #9C5762;
          }
          .btn-secondary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: #FAF5F0;
            color: #4A3B39;
            border: 1px solid #E5DCD5;
            padding: 12px;
            border-radius: 12px;
            font-size: 0.88rem;
            text-decoration: none;
          }
          .btn-danger {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: none;
            border: none;
            color: #9C5762;
            padding: 8px;
            font-size: 0.82rem;
            cursor: pointer;
            margin-top: 4px;
          }
        `}</style>
      </div>
    );
  }

  return (
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

      <style jsx>{`
        .admin-root-layout {
          min-height: 100vh;
          background-color: #F8F5F2;
          font-family: var(--font-ui), 'Jost', sans-serif;
          color: #342727;
        }

        .admin-main-container {
          margin-left: 250px;
          padding-top: 68px;
          min-height: 100vh;
          transition: margin-left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .admin-main-container.sidebar-collapsed {
          margin-left: 76px;
        }

        .admin-main-inner {
          padding: clamp(16px, 2.5vw, 32px);
          max-width: 1560px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .admin-main-container {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
