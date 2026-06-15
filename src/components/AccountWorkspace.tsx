"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type InsuranceProfile = {
  id: string;
  profile_name: string;
  user_type: string;
  state: string;
  scenarios: string[];
  description: string;
  created_at: string;
};

type CoverageReport = {
  id: string;
  title: string;
  suggestions: unknown[];
  matches: unknown[];
  created_at: string;
};

type PolicyVaultItem = {
  id: string;
  policy_name: string;
  provider: string;
  policy_type: string;
  renewal_date: string | null;
  notes: string;
};

type RenewalReminder = {
  id: string;
  title: string;
  due_date: string | null;
  notes: string;
  completed: boolean;
};

type SavedAlert = {
  id: string;
  alert_type: string;
  title: string;
  description: string;
  is_active: boolean;
};

export default function AccountWorkspace() {
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<InsuranceProfile[]>([]);
  const [reports, setReports] = useState<CoverageReport[]>([]);
  const [policies, setPolicies] = useState<PolicyVaultItem[]>([]);
  const [reminders, setReminders] = useState<RenewalReminder[]>([]);
  const [alerts, setAlerts] = useState<SavedAlert[]>([]);

  const [policyName, setPolicyName] = useState("");
  const [provider, setProvider] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [policyNotes, setPolicyNotes] = useState("");

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderNotes, setReminderNotes] = useState("");

  const [alertType, setAlertType] = useState("General");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const [message, setMessage] = useState("");

  async function loadAccountData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    const [profilesResult, reportsResult, policiesResult, remindersResult, alertsResult] =
      await Promise.all([
        supabase
          .from("insurance_profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("coverage_reports")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("policy_vault_items")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("renewal_reminders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_alerts")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

    setProfiles((profilesResult.data as InsuranceProfile[]) ?? []);
    setReports((reportsResult.data as CoverageReport[]) ?? []);
    setPolicies((policiesResult.data as PolicyVaultItem[]) ?? []);
    setReminders((remindersResult.data as RenewalReminder[]) ?? []);
    setAlerts((alertsResult.data as SavedAlert[]) ?? []);

    setLoading(false);
  }

  useEffect(() => {
    loadAccountData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  async function addPolicy() {
    if (!user || !policyName) return;

    const { error } = await supabase.from("policy_vault_items").insert({
      user_id: user.id,
      policy_name: policyName,
      provider,
      policy_type: policyType,
      renewal_date: renewalDate || null,
      notes: policyNotes,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setPolicyName("");
    setProvider("");
    setPolicyType("");
    setRenewalDate("");
    setPolicyNotes("");
    setMessage("Policy saved.");
    await loadAccountData();
  }

  async function addReminder() {
    if (!user || !reminderTitle) return;

    const { error } = await supabase.from("renewal_reminders").insert({
      user_id: user.id,
      title: reminderTitle,
      due_date: reminderDate || null,
      notes: reminderNotes,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setReminderTitle("");
    setReminderDate("");
    setReminderNotes("");
    setMessage("Reminder saved.");
    await loadAccountData();
  }

  async function addAlert() {
    if (!user || !alertTitle) return;

    const { error } = await supabase.from("saved_alerts").insert({
      user_id: user.id,
      alert_type: alertType,
      title: alertTitle,
      description: alertDescription,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setAlertType("General");
    setAlertTitle("");
    setAlertDescription("");
    setMessage("Alert saved.");
    await loadAccountData();
  }

  async function deleteRow(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Deleted.");
    await loadAccountData();
  }

  if (loading) {
    return <p className="mt-8 text-blue-100/70">Loading your account...</p>;
  }

  if (!user) {
    return (
      <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">You are not signed in.</h2>
        <p className="mt-3 leading-7 text-blue-100/70">
          Sign in or create an account to save your insurance profile.
        </p>

        <a
          href="/auth"
          className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-blue-300"
        >
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Signed in</h2>
            <p className="mt-2 text-blue-100/70">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-fit rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Sign out
          </button>
        </div>

        {message && (
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-blue-100/75">
            {message}
          </p>
        )}
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">Saved Coverage Scout reports</h2>
        <p className="mt-2 text-sm text-blue-100/60">
          Reports saved from the Estimate page will appear here.
        </p>

        {reports.length === 0 ? (
          <p className="mt-5 text-blue-100/60">No reports saved yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="mt-1 text-sm text-blue-100/60">
                      {new Date(report.created_at).toLocaleString()} ·{" "}
                      {report.suggestions.length} cover areas ·{" "}
                      {report.matches.length} matched options
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
  <a
    href={`/reports/${report.id}`}
    className="w-fit rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-[#07111f] hover:bg-blue-300"
  >
    Open report
  </a>

  <button
    type="button"
    onClick={() => deleteRow("coverage_reports", report.id)}
    className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
  >
    Delete
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">Stored insurance profile answers</h2>

        {profiles.length === 0 ? (
          <p className="mt-5 text-blue-100/60">No profile answers saved yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold">{profile.profile_name}</h3>
                    <p className="mt-1 text-sm text-blue-100/60">
                      {profile.user_type} · {profile.state}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-blue-100/70">
                      {profile.description || "No written description saved."}
                    </p>
                    {profile.scenarios.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.scenarios.map((scenario) => (
                          <span
                            key={scenario}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-blue-100/70"
                          >
                            {scenario}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteRow("insurance_profiles", profile.id)}
                    className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">Policy vault</h2>
        <p className="mt-2 text-sm text-yellow-100/70">
          Prototype only: save basic policy details for now. Do not upload real documents yet.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={policyName}
            onChange={(event) => setPolicyName(event.target.value)}
            placeholder="Policy name"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
          <input
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            placeholder="Provider"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
          <input
            value={policyType}
            onChange={(event) => setPolicyType(event.target.value)}
            placeholder="Policy type"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
          <input
            type="date"
            value={renewalDate}
            onChange={(event) => setRenewalDate(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
          />
        </div>

        <textarea
          value={policyNotes}
          onChange={(event) => setPolicyNotes(event.target.value)}
          placeholder="Notes"
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
        />

        <button
          type="button"
          onClick={addPolicy}
          className="mt-4 rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
        >
          Add policy
        </button>

        <div className="mt-6 space-y-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold">{policy.policy_name}</h3>
                  <p className="mt-1 text-sm text-blue-100/60">
                    {policy.provider || "No provider"} ·{" "}
                    {policy.policy_type || "No type"}
                  </p>
                  <p className="mt-1 text-sm text-blue-100/60">
                    Renewal: {policy.renewal_date || "Not set"}
                  </p>
                  <p className="mt-3 text-sm text-blue-100/70">{policy.notes}</p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteRow("policy_vault_items", policy.id)}
                  className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">Renewal reminders</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={reminderTitle}
            onChange={(event) => setReminderTitle(event.target.value)}
            placeholder="Reminder title"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
          <input
            type="date"
            value={reminderDate}
            onChange={(event) => setReminderDate(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
          />
        </div>

        <textarea
          value={reminderNotes}
          onChange={(event) => setReminderNotes(event.target.value)}
          placeholder="Reminder notes"
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
        />

        <button
          type="button"
          onClick={addReminder}
          className="mt-4 rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
        >
          Add reminder
        </button>

        <div className="mt-6 space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold">{reminder.title}</h3>
                  <p className="mt-1 text-sm text-blue-100/60">
                    Due: {reminder.due_date || "Not set"}
                  </p>
                  <p className="mt-3 text-sm text-blue-100/70">{reminder.notes}</p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteRow("renewal_reminders", reminder.id)}
                  className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <h2 className="text-2xl font-semibold">Saved alerts</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={alertType}
            onChange={(event) => setAlertType(event.target.value)}
            placeholder="Alert type"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
          <input
            value={alertTitle}
            onChange={(event) => setAlertTitle(event.target.value)}
            placeholder="Alert title"
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
        </div>

        <textarea
          value={alertDescription}
          onChange={(event) => setAlertDescription(event.target.value)}
          placeholder="Alert description"
          rows={3}
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
        />

        <button
          type="button"
          onClick={addAlert}
          className="mt-4 rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
        >
          Add alert
        </button>

        <div className="mt-6 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-blue-100/50">{alert.alert_type}</p>
                  <h3 className="mt-1 font-semibold">{alert.title}</h3>
                  <p className="mt-3 text-sm text-blue-100/70">
                    {alert.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteRow("saved_alerts", alert.id)}
                  className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}