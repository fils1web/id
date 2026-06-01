"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/files", label: "Files" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
                BIA CO
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-body rounded-full transition-all duration-300",
                    pathname === link.href
                      ? "text-gold bg-gold/10"
                      : "text-gray-400 hover:text-gold hover:bg-gold/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-body text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 inline mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-body text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4 inline mr-1" />
                    Logout
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gold p-2"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-gold/10 md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 font-body rounded-xl transition-all duration-300",
                    pathname === link.href
                      ? "text-gold bg-gold/10 border border-gold/20"
                      : "text-gray-400 hover:text-gold hover:bg-gold/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 font-body text-cyan-400 rounded-xl hover:bg-cyan-500/10"
                  >
                    <LayoutDashboard className="w-4 h-4 inline mr-2" />Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="block w-full text-left px-4 py-3 font-body text-red-400 rounded-xl hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
