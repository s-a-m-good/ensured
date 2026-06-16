import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const origin = new URL(request.url).origin;

  if (!email || !password) {
    return NextResponse.redirect(
      `${origin}/auth/sign-up?error=Please enter an email and password.`,
      303
    );
  }

  if (password.length < 6) {
    return NextResponse.redirect(
      `${origin}/auth/sign-up?error=Password must be at least 6 characters.`,
      303
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      `${origin}/auth/sign-up?error=Supabase environment variables are missing.`,
      303
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/sign-in`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-up?error=${encodeURIComponent(error.message)}`,
      303
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/sign-in?message=Account created. Check your email if confirmation is enabled, then sign in.`,
    303
  );
}
