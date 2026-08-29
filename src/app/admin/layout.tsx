import { requireAdmin } from "@/lib/require-admin";
import { Container } from "@/components/ui/Container";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: { template: "%s · Admin", default: "Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <Container className="py-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-surface p-3 lg:sticky lg:top-24">
          <AdminSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
