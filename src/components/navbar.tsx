"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/validate", label: "Validate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
];

type NavbarProps = {
  onMobileMenu?: () => void;
};

export function Navbar({ onMobileMenu }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const paletteInputRef = useRef<HTMLInputElement | null>(null);
  const closePalette = useCallback(() => {
    setIsPaletteOpen(false);
    setPaletteQuery("");
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session));
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthed(Boolean(session));
        setUserEmail(session?.user?.email ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (isPaletteOpen) {
      paletteInputRef.current?.focus();
    }
  }, [isPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isPaletteOpen) {
        closePalette();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isPaletteOpen) {
          closePalette();
          return;
        }
        setPaletteQuery("");
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePalette, isPaletteOpen]);

  const commandItems = useMemo(() => {
    const baseCommands = [
      {
        label: "Validate idea",
        description: "Jump straight into the validation flow.",
        action: () => router.push("/validate"),
      },
      {
        label: "Dashboard",
        description: "Review your latest validations and metrics.",
        action: () => router.push("/dashboard"),
      },
      {
        label: "Reports",
        description: "Revisit saved AI validation reports.",
        action: () => router.push("/reports"),
      },
      {
        label: "Generate ideas",
        description: "Ask the AI for tailored idea sparks.",
        action: () => router.push("/generate-ideas"),
      },
      {
        label: "Compare ideas",
        description: "Analyze two ideas side-by-side.",
        action: () => router.push("/compare"),
      },
    ];

    if (isAuthed) {
      return [
        ...baseCommands,
        {
          label: "Profile",
          description: "Access your account settings.",
          action: () => router.push("/profile"),
        },
        {
          label: "Log out",
          description: "Sign out of your workspace.",
          action: () => {
            handleLogout();
          },
        },
      ];
    }

    return [
      ...baseCommands,
      {
        label: "Log in",
        description: "Authenticate to unlock features.",
        action: () => router.push("/login"),
      },
    ];
  }, [isAuthed, router, handleLogout]);

  const filteredCommands = commandItems.filter((command) =>
    `${command.label} ${command.description}`.toLowerCase().includes(
      paletteQuery.trim().toLowerCase(),
    ),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-none items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          {onMobileMenu && (
            <button
              type="button"
              onClick={onMobileMenu}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-white/20 dark:bg-slate-800/80 dark:text-white lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          {/* <Link href="/" className="cursor-pointer text-xl font-semibold tracking-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">AI Startup Idea Validator</p>

          </Link> */}
        </div>
        <div className="flex flex-1 justify-center px-4">
          <button
            type="button"
            onClick={() => {
              setIsPaletteOpen(true);
              setPaletteQuery("");
            }}
            className="flex w-full max-w-lg items-center justify-between rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm text-slate-700 transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/20 dark:bg-slate-900/60 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Type a command or search</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-slate-400">⌘ K</span>
          </button>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "cursor-pointer text-base font-medium transition hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthed && (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
              <span className="hidden max-w-[180px] truncate text-sm font-medium lg:inline">
                {userEmail ?? "Account"}
              </span>
            </Link>
          )}
          {isAuthed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-full border border-border px-3 py-2 text-base font-medium transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer rounded-full bg-primary px-3 py-2 text-base font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>

      {isPaletteOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/20 px-4 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-border/60 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Command palette
                </p>
                <p className="text-sm text-muted-foreground">
                  Access anything with a keystroke.
                </p>
              </div>
              <button
                type="button"
                onClick={closePalette}
                className="text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
                aria-label="Close command palette"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                className="w-full rounded-2xl border border-border/60 bg-background/90 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Try commands like Dashboard, Reports, Validate idea…"
                aria-label="Command palette input"
              />
            </div>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <p className="text-sm text-slate-500">No matching commands.</p>
              ) : (
                filteredCommands.map((command) => (
                  <button
                    key={command.label}
                    type="button"
                    onClick={() => {
                      closePalette();
                      command.action();
                    }}
                    className="flex w-full flex-col rounded-2xl border border-border/60 bg-white/90 px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-primary/10 dark:bg-slate-900/80 dark:hover:bg-indigo-500/20"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {command.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {command.description}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
