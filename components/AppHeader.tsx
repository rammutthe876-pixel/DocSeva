import Link from "next/link";

interface AppHeaderProps {
  current?: "home" | "upload" | "vault";
}

const links = [
  { href: "/upload", label: "Upload", key: "upload" },
  { href: "/vault", label: "Vault", key: "vault" }
] as const;

export function AppHeader({ current }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-bold uppercase tracking-[0.24em] text-white">
            DS
          </span>
          <span className="font-display text-3xl text-textPrimary">DocSeva</span>
        </Link>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const isActive = current === link.key;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand text-white"
                    : "border border-slate-300 text-textPrimary hover:border-brand hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
