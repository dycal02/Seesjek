'use client';
import { useState, useEffect } from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, LogOut, Menu, X, BarChart3, Truck, Users } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Redirect ke login setelah logout berhasil
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <div className="flex flex-col md:flex-row h-screen">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#25AEAE] text-white rounded-lg hover:bg-[#1e8a8a] transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Sidebar Navigation */}
          <aside
            className={`fixed md:static w-64 bg-[#25AEAE] text-white p-6 h-screen overflow-y-auto transition-all z-40 flex flex-col ${
              isMobileMenuOpen ? 'left-0' : '-left-64 md:left-0'
            }`}
          >
            {/* Logo - Clickable */}
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mb-8 h-16 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition cursor-pointer gap-2">
                <Package className="w-8 h-8 text-[#25AEAE]" />
                <span className="text-sm font-bold text-[#25AEAE] hidden sm:inline">Seesjek</span>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="space-y-2 flex-1">
              <NavLink
                href="/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/dashboard/order"
                label="Order"
                icon={BarChart3}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/dashboard/driver"
                label="Driver"
                icon={Truck}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/dashboard/user"
                label="User"
                icon={Users}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </nav>

            {/* Divider */}
            <div className="border-t border-[#1e8a8a] my-6"></div>

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </aside>

          {/* Overlay untuk mobile */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto w-full md:w-auto pt-16 md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();

  // Perbaikan logika active state
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
        isActive
          ? "bg-[#236C6C] font-semibold shadow-md"
          : "hover:bg-[#236C6C] text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
