"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Bolt,
    ChartNoAxesCombined,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    DollarSign,
    Layers,
    Lightbulb,
    LogOut,
    Scale,
    Search,
    Signal,
    Sparkles,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
    { href: "/generate-ideas", label: "Idea Generator", icon: Lightbulb },
    { href: "/validate", label: "Idea Validator", icon: Bolt },
    { href: "/reports", label: "Reports", icon: Layers },
    { href: "/mvp-planner", label: "MVP Planner", icon: ClipboardList },
    { href: "/compare", label: "Comparison", icon: Scale },
    { href: "/competitors", label: "Competitors", icon: Search },
    { href: "/reports/market-insights", label: "Market Insights", icon: Signal },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/profile", label: "User Profile", icon: Sparkles },
];

type SidebarProps = {
    mobile?: boolean;
    open?: boolean;
    onClose?: () => void;
};

export function Sidebar({ mobile = false, open = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createSupabaseBrowserClient();
        supabase.auth.getSession().then(({ data }) => {
            const session = data.session;
            setIsAuthed(Boolean(session));
            setUserEmail(session?.user?.email ?? null);
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

    const handleLogout = async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        onClose?.();
        router.push("/");
    };

    if (!isAuthed) return null;

    const desktopClasses = cn(
        "sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-slate-200/60 bg-white/70 backdrop-blur-lg transition-all duration-300 lg:flex dark:border-white/10 dark:bg-slate-900/60",
        collapsed ? "w-[72px] px-2 py-5" : "w-[260px] p-5"
    );

    const mobileClasses = cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/60 bg-white/95 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out dark:border-white/10 dark:bg-slate-900/80",
        collapsed ? "w-[72px] px-2 py-5" : "w-[260px] p-5",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:hidden"
    );

    const wrapperClass = mobile ? mobileClasses : desktopClasses;
    const showCollapseToggle = !mobile;

    const handleLinkClick = () => {
        if (mobile) {
            onClose?.();
        }
    };

    return (
        <aside className={wrapperClass}>
            {/* Logo */}
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-purple-500 text-white">
                    <Sparkles className="h-5 w-5" />
                </div>
                {!collapsed && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">AI STARTUP</p>
                        <p className="text-lg font-semibold">Idea Validator</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav
                className={cn(
                    "mt-6 grid gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200",
                    collapsed && "mt-4"
                )}
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            onClick={handleLinkClick}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors",
                                isActive
                                    ? "bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white"
                                    : "hover:bg-slate-900/5 dark:hover:bg-white/10",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* AI Signals card */}
            {!collapsed && (
                <div className="mt-auto rounded-2xl border border-slate-200/60 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent p-4 text-sm text-slate-700 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.6)] dark:border-white/10 dark:bg-slate-900/60 dark:text-white">
                    <p className="font-semibold">AI Signals</p>
                    <p className="mt-1 text-xs">3 ideas show rising demand based on current market chatter.</p>
                </div>
            )}

            {/* User profile + collapse toggle */}
            <div className={cn("mt-auto pt-4 space-y-3", !collapsed && "mt-4")}>
                {/* User profile */}
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-slate-800/60",
                        collapsed && "justify-center p-2"
                    )}
                >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <Link
                                href="/profile"
                                onClick={handleLinkClick}
                                className="block truncate text-sm font-semibold text-slate-900 hover:text-primary dark:text-white"
                            >
                                {userEmail ?? "Account"}
                            </Link>
                            <p className="truncate text-xs text-muted-foreground">Pro Plan</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                            aria-label="Log out"
                            title="Log out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Collapse toggle */}
                {showCollapseToggle && (
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/60 bg-slate-50/80 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-700/60",
                            collapsed && "px-2"
                        )}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <>
                                <ChevronLeft className="h-4 w-4" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </aside>
    );
}
