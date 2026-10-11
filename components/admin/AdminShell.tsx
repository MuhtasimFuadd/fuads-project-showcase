import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
          <nav className="flex flex-wrap items-center gap-5 text-paper/70">
            <Link href="/admin" className="font-display text-base text-paper">
              Admin
            </Link>
            <Link href="/admin/projects" className="hover:text-paper">Projects</Link>
            <Link href="/admin/site" className="hover:text-paper">Site content</Link>
            <Link href="/admin/messages" className="hover:text-paper">Messages</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/" target="_blank" className="text-accent-light hover:underline">View site ↗</Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-content px-6 py-12">
        <h1 className="font-display text-3xl text-paper">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-paper/55">{description}</p>}
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}

export function SetupNotice() {
  return (
    <div className="max-w-2xl rounded-2xl border border-accent/40 bg-accent/5 p-6 text-paper/75">
      <p className="font-display text-lg text-accent-light">Connect Supabase to start editing</p>
      <p className="mt-2 text-sm">
        The admin panel needs <code className="font-mono text-accent-light">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="font-mono text-accent-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="font-mono text-accent-light">SUPABASE_SERVICE_ROLE_KEY</code> in your environment
        variables (and <code className="font-mono text-accent-light">supabase/schema.sql</code> run once in the
        Supabase SQL editor). See the README, then reload this page.
      </p>
    </div>
  );
}
