"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2 } from "lucide-react";

type Tab = "login" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      }
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-[420px] rounded-3xl p-6 shadow-2xl shadow-black/10 md:p-8"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            AI Startup Idea Validator
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sign in to validate your startup ideas
          </p>
        </div>

        <div className="mt-8 rounded-full border border-border bg-muted/40 p-1 text-base">
          <div className="relative grid grid-cols-2">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-card shadow-sm"
              animate={{ x: tab === "login" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`relative z-10 rounded-full px-3 py-2 font-semibold transition ${
                tab === "login" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={`relative z-10 rounded-full px-3 py-2 font-semibold transition ${
                tab === "signup" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6 grid gap-4"
          >
            <div className="grid gap-2 text-base">
              <label htmlFor="email" className="font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                type="email"
                className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="grid gap-2 text-base">
              <label htmlFor="password" className="font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                className="rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleAuth}
              disabled={loading || !email || !password}
              whileHover={{ y: -2 }}
              className="relative inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? "Processing..."
                : tab === "login"
                ? "Sign In"
                : "Create Account"}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
