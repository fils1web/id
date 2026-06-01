"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ParticlesBg } from "@/components/ui/ParticlesBg";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AIAssistant } from "@/components/ai/AIAssistant";

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname.startsWith("/login");

  const sidebarMargin = isDashboard ? "md:ml-[72px]" : "md:ml-[72px]";

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen />}
      </AnimatePresence>
      {!loading && (
        <>
          <ParticlesBg />
          <Navbar />
          <Sidebar />
          <main className={`min-h-screen ${sidebarMargin}`}>
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </>
      )}
    </>
  );
}
