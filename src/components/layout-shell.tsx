"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PUBLIC_ROUTES = ["/", "/login"];

export function LayoutShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    // SSR-safe: default to true (open) for mobile sidebar on non-public routes
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return !PUBLIC_ROUTES.includes(window.location.pathname);
    });
    // Auth state
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Only check auth for protected routes
        if (isPublic) return;
        const supabase = createSupabaseBrowserClient();
        supabase.auth.getSession().then(({ data }) => {
            setIsAuthed(Boolean(data.session));
            setUserEmail(data.session?.user?.email ?? null);
            setAuthChecked(true);
        });
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setIsAuthed(Boolean(session));
                setUserEmail(session?.user?.email ?? null);
                setAuthChecked(true);
            }
        );
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [isPublic]);

    const openMobileSidebar = () => setMobileSidebarOpen(true);
    const closeMobileSidebar = () => setMobileSidebarOpen(false);

    if (isPublic) {
        return (
            <>
                <Navbar />
                <main className="min-h-[70vh]">{children}</main>
                <Footer />
            </>
        );
    }

    // Show loading spinner while checking auth
    if (!authChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
            </div>
        );
    }
    // If not authed, redirect to login
    if (!isAuthed) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        // Render nothing while redirecting
        return null;
    }

    // Render sidebar before overlay for mobile, and before dashboard for desktop
    return (
        <>
            <div className="lg:hidden">
                <Sidebar mobile open={mobileSidebarOpen} onClose={closeMobileSidebar} />
                <div
                    className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity ${mobileSidebarOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                        }`}
                    aria-hidden="true"
                    onClick={closeMobileSidebar}
                />
            </div>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Navbar onMobileMenu={openMobileSidebar} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </div>
            </div>
        </>
    );
}
