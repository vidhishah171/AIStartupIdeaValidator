"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";

const PUBLIC_ROUTES = ["/", "/login"];

export function LayoutShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [pathname]);

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

    return (
        <>
            <div className="lg:hidden">
                <div
                    className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity ${
                        mobileSidebarOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    aria-hidden="true"
                    onClick={closeMobileSidebar}
                />
                <Sidebar mobile open={mobileSidebarOpen} onClose={closeMobileSidebar} />
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
