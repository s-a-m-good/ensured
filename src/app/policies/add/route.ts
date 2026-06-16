import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function moneyValue(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? Number(text) : null;
}

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

  const policyName = String(formData.get("policy_name") || "").trim();

  if (!policyName) {
    return NextResponse.redirect(
      `${origin}/policies?error=Policy name is required.`,
      303
    );
  }

  const { error } = await supabase.from("policy_vault_items").insert({
    user_id: user.id,
    policy_name: policyName,
    provider: String(formData.get("provider") || ""),
    policy_type: String(formData.get("policy_type") || ""),
    renewal_date: String(formData.get("renewal_date") || "") || null,
    premium_amount: moneyValue(formData.get("premium_amount")),
    excess_amount: moneyValue(formData.get("excess_amount")),
    cover_limit_amount: moneyValue(formData.get("cover_limit_amount")),
    important_exclusions: String(formData.get("important_exclusions") || ""),
    certificate_of_currency: String(formData.get("certificate_of_currency") || ""),
    portable_valuables_note: String(formData.get("portable_valuables_note") || ""),
    notes: String(formData.get("notes") || ""),
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/policies?error=${encodeURIComponent(error.message)}`,
      303
    );
  }

  return NextResponse.redirect(`${origin}/policies?message=Policy saved.`, 303);
}
