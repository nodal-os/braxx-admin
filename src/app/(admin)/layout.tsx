import { CommandBar } from "@/components/admin/CommandBar";
import { HorizontalNav } from "@/components/admin/HorizontalNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="brand-paper-field pointer-events-none fixed inset-0 z-0" />
      <header className="sticky top-0 z-40 bg-background/92 backdrop-blur-sm">
        <CommandBar />
        <HorizontalNav />
      </header>
      <main className="relative z-10 px-3 sm:px-4 py-6 max-w-[1600px] mx-auto">{children}</main>
    </div>
  );
}
