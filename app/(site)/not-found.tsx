import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-accent-light">404</p>
      <h1 className="mt-2 font-display text-4xl">That page wandered off.</h1>
      <Link href="/projects" className="btn mt-8">Browse projects</Link>
    </main>
  );
}
