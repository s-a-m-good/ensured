import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Estimate", href: "/estimate" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Policies", href: "/policies" },
  { label: "Alerts", href: "/alerts" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Ensured
        </Link>

        <div className="hidden items-center gap-6 text-sm text-blue-100/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/estimate"
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#07111f] transition hover:scale-105 hover:bg-blue-100"
        >
          Start estimate
        </Link>
      </nav>
    </header>
  );
}