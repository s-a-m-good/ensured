import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type PoliciesPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

type PolicyVaultItem = {
  id: string;
  policy_name: string;
  provider: string | null;
  policy_type: string | null;
  renewal_date: string | null;
  notes: string | null;
  premium_amount: number | null;
  excess_amount: number | null;
  cover_limit_amount: number | null;
  important_exclusions: string | null;
  certificate_of_currency: string | null;
  portable_valuables_note: string | null;
};

function formatMoney(value: number | null) {
  if (value === null || value === undefined) return "Not set";

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function daysUntil(dateString: string | null) {
  if (!dateString) return null;

  const today = new Date();
  const target = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function PoliciesPage({ searchParams }: PoliciesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let policies: PolicyVaultItem[] = [];

  if (user) {
    const { data } = await supabase
      .from("policy_vault_items")
      .select("*")
      .order("created_at", { ascending: false });

    policies = (data as PolicyVaultItem[]) ?? [];
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Policy vault
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Keep insurance documents and details organised.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Add useful policy information such as renewal dates, premium, excess,
          cover limit, exclusions, certificate of currency notes, and portable
          valuables notes.
        </p>

        {!user && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Sign in required</h2>
            <p className="mt-3 text-blue-100/70">
              Sign in before adding policies to your vault.
            </p>

            <a
              href="/auth/sign-in"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Sign in
            </a>
          </div>
        )}

        {user && (
          <>
            {(params?.message || params?.error) && (
              <p
                className={`mt-8 rounded-2xl border p-4 text-sm ${
                  params?.error
                    ? "border-red-300/20 bg-red-400/10 text-red-100"
                    : "border-blue-300/20 bg-blue-400/10 text-blue-100"
                }`}
              >
                {params?.error || params?.message}
              </p>
            )}

            <form
              action="/policies/add"
              method="post"
              className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
            >
              <h2 className="text-2xl font-semibold">Add policy</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  name="policy_name"
                  required
                  placeholder="Policy name"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />

                <input
                  name="provider"
                  placeholder="Insurer/provider"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />

                <select
                  name="policy_type"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
                >
                  <option value="">Policy type</option>
                  <option>Home and contents</option>
                  <option>Contents</option>
                  <option>Car</option>
                  <option>Landlord</option>
                  <option>Public liability</option>
                  <option>Professional indemnity</option>
                  <option>Cyber</option>
                  <option>Business pack</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>

                <input
                  name="renewal_date"
                  type="date"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
                />

                <input
                  name="premium_amount"
                  type="number"
                  min="0"
                  placeholder="Premium amount, e.g. 1200"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />

                <input
                  name="excess_amount"
                  type="number"
                  min="0"
                  placeholder="Excess, e.g. 750"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />

                <input
                  name="cover_limit_amount"
                  type="number"
                  min="0"
                  placeholder="Cover limit, e.g. 1000000"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />

                <input
                  name="certificate_of_currency"
                  placeholder="Certificate of currency note/link"
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
                />
              </div>

              <textarea
                name="important_exclusions"
                placeholder="Important exclusions or conditions"
                rows={3}
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />

              <textarea
                name="portable_valuables_note"
                placeholder="Portable valuables note, e.g. laptop and camera covered away from home up to $5,000"
                rows={3}
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />

              <textarea
                name="notes"
                placeholder="General notes"
                rows={3}
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />

              <button
                type="submit"
                className="mt-5 w-full cursor-pointer rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] hover:bg-blue-300"
              >
                Add policy
              </button>
            </form>

            <div className="mt-10 space-y-5">
              {policies.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-blue-100/60">
                  No policies saved yet.
                </p>
              ) : (
                policies.map((policy) => {
                  const renewalDays = daysUntil(policy.renewal_date);

                  return (
                    <div
                      key={policy.id}
                      className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-blue-100/50">
                            {policy.policy_type || "No policy type"}
                          </p>

                          <h2 className="mt-1 text-2xl font-semibold">
                            {policy.policy_name}
                          </h2>

                          <p className="mt-1 text-sm text-blue-100/60">
                            {policy.provider || "No provider saved"}
                          </p>
                        </div>

                        <form action="/policies/delete" method="post">
                          <input type="hidden" name="id" value={policy.id} />

                          <button
                            type="submit"
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-xs text-blue-100/45">Renewal</p>
                          <p className="mt-1 text-sm text-blue-100/80">
                            {policy.renewal_date || "Not set"}
                          </p>
                          {renewalDays !== null && (
                            <p className="mt-1 text-xs text-blue-100/50">
                              {renewalDays >= 0
                                ? `${renewalDays} days away`
                                : `${Math.abs(renewalDays)} days overdue`}
                            </p>
                          )}
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-xs text-blue-100/45">Premium</p>
                          <p className="mt-1 text-sm text-blue-100/80">
                            {formatMoney(policy.premium_amount)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-xs text-blue-100/45">Excess</p>
                          <p className="mt-1 text-sm text-blue-100/80">
                            {formatMoney(policy.excess_amount)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-xs text-blue-100/45">Cover limit</p>
                          <p className="mt-1 text-sm text-blue-100/80">
                            {formatMoney(policy.cover_limit_amount)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-sm font-semibold text-blue-100">
                            Important exclusions
                          </p>
                          <p className="mt-2 text-sm leading-6 text-blue-100/65">
                            {policy.important_exclusions ||
                              "No exclusions saved."}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                          <p className="text-sm font-semibold text-blue-100">
                            Certificate of currency
                          </p>
                          <p className="mt-2 text-sm leading-6 text-blue-100/65">
                            {policy.certificate_of_currency ||
                              "No certificate note/link saved."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                        <p className="text-sm font-semibold text-blue-100">
                          Portable valuables note
                        </p>
                        <p className="mt-2 text-sm leading-6 text-blue-100/65">
                          {policy.portable_valuables_note ||
                            "No portable valuables note saved."}
                        </p>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                        <p className="text-sm font-semibold text-blue-100">
                          Notes
                        </p>
                        <p className="mt-2 text-sm leading-6 text-blue-100/65">
                          {policy.notes || "No notes saved."}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
