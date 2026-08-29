import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const supabase = createAdminClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Messages</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {messages?.length ?? 0} message{messages?.length === 1 ? "" : "s"} from the Contact Us form
      </p>

      {!messages?.length ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center text-sm text-ink-dim">
          No messages yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">{m.name}</p>
                <p className="text-xs text-ink-dim">
                  {new Date(m.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="mt-1 text-xs text-ink-dim">
                {[m.email, m.phone].filter(Boolean).join(" · ")}
              </p>
              {m.subject && <p className="mt-2 text-sm font-semibold text-ink">{m.subject}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">{m.message}</p>
              <div className="mt-3 flex gap-3">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-xs font-semibold text-brand-700 hover:underline">
                    Reply by Email
                  </a>
                )}
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="text-xs font-semibold text-brand-700 hover:underline">
                    Call
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
