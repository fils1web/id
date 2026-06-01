"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      router.push("/dashboard");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-gold" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">Dashboard Access</h1>
            <p className="text-sm text-gray-400 font-body mt-1">Enter password to continue</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white font-body placeholder:text-gray-500 focus:outline-none focus:border-gold/50 text-center text-lg tracking-widest"
                autoFocus
              />
            </motion.div>

            <GoldButton type="submit" loading={isLoading} className="w-full">
              Access Dashboard
            </GoldButton>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
