import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin = new URL(request.url).origin;

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/sign-in`, 303);
  }

  const formData = await request.formData();
  const id = String(formData.get("id") || "");

  if (id) {
    await supabase.from("policy_vault_items").delete().eq("id", id);
  }

  return NextResponse.redirect(`${origin}/policies?message=Policy deleted.`, 303);
}
