import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MVPPlannerShell } from "@/components/mvp-planner-shell";

export default async function MVPPlannerPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
            <MVPPlannerShell />
        </section>
    );
}
