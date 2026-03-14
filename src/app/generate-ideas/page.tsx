import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GenerateIdeasShell } from "@/components/generate-ideas-shell";

export default async function GenerateIdeasPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <GenerateIdeasShell />
    </div>
  );
}
