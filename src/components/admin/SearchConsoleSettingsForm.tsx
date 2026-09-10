"use client";

import { useActionState } from "react";
import {
  updateSearchConsoleSettings,
  type SearchConsoleSettings,
  type SearchConsoleSettingsFormState,
} from "@/lib/actions/search-console";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const textareaClass =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono";

export function SearchConsoleSettingsForm({ initial }: { initial: SearchConsoleSettings }) {
  const [state, formAction, pending] = useActionState<SearchConsoleSettingsFormState, FormData>(
    updateSearchConsoleSettings,
    {},
  );

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <p className="text-sm text-ink-soft">
        Google Search Console lets you verify ownership of{" "}
        <span className="font-semibold text-ink">itparkfeni.vercel.app</span> in a few different ways. Use whichever
        one Google shows you when you add the property — you only need one, but you can fill in more than one.
      </p>

      {/* Method 1: HTML tag */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Method: HTML tag</span>
        <p className="mt-1 text-xs text-ink-dim">
          In Search Console, pick &ldquo;HTML tag&rdquo; and paste the whole{" "}
          <code className="rounded bg-muted px-1 py-0.5">&lt;meta name=&quot;google-site-verification&quot;
          ...&gt;</code> tag below (or just the code inside <code className="rounded bg-muted px-1 py-0.5">content=&quot;...&quot;</code>
          — either works).
        </p>
        <textarea
          name="metaTagContent"
          defaultValue={initial.metaTagContent}
          placeholder='<meta name="google-site-verification" content="abcXYZ123..." />'
          rows={2}
          className={`${textareaClass} mt-2`}
        />
      </div>

      {/* Method 2: HTML file */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Method: HTML file</span>
        <p className="mt-1 text-xs text-ink-dim">
          In Search Console, pick &ldquo;HTML file&rdquo;, download the <code className="rounded bg-muted px-1 py-0.5">googleXXXXXXXX.html</code>{" "}
          file, open it in a text editor, and paste its contents below. The site will host it at the exact filename
          automatically —{" "}
          {initial.htmlFileName ? (
            <>
              currently live at{" "}
              <code className="rounded bg-muted px-1 py-0.5">/{initial.htmlFileName}</code>
            </>
          ) : (
            "no file saved yet"
          )}
          .
        </p>
        <textarea
          name="htmlFileContent"
          defaultValue={initial.htmlFileContent}
          placeholder="google-site-verification: googleXXXXXXXXXXXXXXXX.html"
          rows={2}
          className={`${textareaClass} mt-2`}
        />
      </div>

      {/* Method 3: Google Analytics */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Method: Google Analytics</span>
        <p className="mt-1 text-xs text-ink-dim">
          Only works if the Search Console account is the same one that manages this GA property. Enter the
          Measurement ID and the site will load the GA tracking snippet on every page.
        </p>
        <input
          name="gaMeasurementId"
          defaultValue={initial.gaMeasurementId}
          placeholder="G-XXXXXXXXXX"
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* Method 4: Google Tag Manager */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-dim">Method: Google Tag Manager</span>
        <p className="mt-1 text-xs text-ink-dim">
          Same idea — only works if Search Console and this GTM container share an account. Enter the Container ID
          and the site will load the GTM snippet on every page.
        </p>
        <input
          name="gtmContainerId"
          defaultValue={initial.gtmContainerId}
          placeholder="GTM-XXXXXXX"
          className={`${inputClass} mt-2`}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
          Saved! Go back to Search Console and click &ldquo;Verify&rdquo; — no redeploy needed.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>

      <p className="text-xs text-ink-dim">
        Note: Search Console&rsquo;s &ldquo;Domain&rdquo; property type (verified via a DNS TXT record at your domain
        provider) isn&rsquo;t handled here — that&rsquo;s configured outside the app, at wherever the domain is
        registered. Use the &ldquo;URL prefix&rdquo; property type in Search Console with one of the four methods
        above instead.
      </p>
    </form>
  );
}
