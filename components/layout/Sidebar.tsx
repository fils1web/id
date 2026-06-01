"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  User,
  FolderKanban,
  Briefcase,
  FileText,
  Mail,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  MessageSquare,
  BarChart3,
  Upload,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: User },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/files", label: "Files", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
];

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/files", label: "Files", icon: Upload },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const showDashboard = pathname.startsWith("/dashboard");
  const links = showDashboard && isAuthenticated ? dashboardLinks : mainLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-bg/90 backdrop-blur-xl border-r border-gold/10 hidden md:flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gold/10">
        {!collapsed && (
          <Link href="/" className="text-xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
            BIA CO
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gold/50 hover:text-gold transition-colors p-1"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                isActive
                  ? "text-gold bg-gold/10 border border-gold/20"
                  : "text-gray-400 hover:text-gold hover:bg-gold/5"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-gold")} />
              {!collapsed && (
                <span className="text-sm font-body whitespace-nowrap">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {showDashboard && isAuthenticated && !collapsed && (
        <div className="px-4 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors py-2"
          >
            <Home className="w-4 h-4" /> Back to Site
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="p-2 border-t border-gold/10">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-body">Logout</span>}
          </button>
        </div>
      )}
    </motion.aside>
  );
}
