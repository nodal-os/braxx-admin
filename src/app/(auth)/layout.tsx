export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div aria-hidden className="brand-paper-field pointer-events-none absolute inset-0" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="workspace-panel p-8">{children}</div>
      </div>
    </div>
  );
}
