import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const origin = new URL(request.url).origin;

  if (!email || !password) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=Please enter an email and password.`,
      303
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=${encodeURIComponent(error.message)}`,
      303
    );
  }

  return NextResponse.redirect(`${origin}/account`, 303);
}
