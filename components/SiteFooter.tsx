import Link from "next/link";
import type { Settings } from "@/lib/content";
import SocialLinks from "./SocialLinks";

export default function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-12 text-sm text-paper/50 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-base text-paper/80">Fuad&apos;s Project Showcase</p>
          <p className="mt-1">
            © {new Date().getFullYear()}
            {settings.footer_note ? ` · ${settings.footer_note}` : ""}
          </p>
          <Link href="/admin" className="mt-3 inline-block text-xs text-paper/30 hover:text-paper/60">
            Admin
          </Link>
        </div>
        <SocialLinks settings={settings} />
      </div>
    </footer>
  );
}
