import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const origin = new URL(request.url).origin;

  await supabase.auth.signOut();

  return NextResponse.redirect(
    `${origin}/auth/sign-in?message=Signed out.`,
    303
  );
}
