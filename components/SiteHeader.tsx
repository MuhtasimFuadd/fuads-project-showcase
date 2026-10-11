import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-display text-base tracking-tight text-paper sm:text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-ink">
            F
          </span>
          <span className="leading-tight">Fuad&apos;s Project Showcase</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-paper/75">
          <Link href="/projects" className="hover:text-paper">Projects</Link>
          <Link href="/#about" className="hidden hover:text-paper sm:inline">About</Link>
          <Link href="/#contact" className="hover:text-paper">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
