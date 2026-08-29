import { ContentPage } from "@/components/layout/ContentPage";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Blog" };

const upcoming = [
  { title: "How to Choose the Right Laptop for University", tag: "Buying Guide" },
  { title: "Budget Gaming PC Builds Under ৳60,000", tag: "PC Builds" },
  { title: "SSD vs HDD: What Actually Speeds Up Your PC", tag: "Explainer" },
  { title: "Setting Up a Reliable Home Wi-Fi Network", tag: "Networking" },
];

export default function BlogPage() {
  return (
    <ContentPage title="Blog" subtitle="Buying guides, PC build ideas and tech tips from our team — publishing soon.">
      <div className="grid gap-3 sm:grid-cols-2">
        {upcoming.map((post) => (
          <div key={post.title} className="rounded-2xl border border-dashed border-line bg-surface p-5">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
              {post.tag}
            </span>
            <h2 className="mt-3 text-sm font-bold text-ink">{post.title}</h2>
            <p className="mt-1 text-xs text-ink-dim">Coming soon</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-brand-50/60 p-5 text-center">
        <p className="text-sm text-ink-soft">
          Have a topic you&rsquo;d like us to cover, or a question our team can answer? Let us know.
        </p>
        <Button href="/contact" className="mt-4">
          Suggest a Topic
        </Button>
      </div>
    </ContentPage>
  );
}
