import Link from "next/link";
import { Icon } from "@/components/icons/Icon";

type NavBarProps = {
  links: { label: string; href: string }[];
};

export function NavBar({ links }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e0d5] bg-[#faf7f2]">
      <div className="mx-auto flex h-20 max-w-wrap items-center justify-between px-wrap-sm md:px-wrap">
        <Link href="/" className="flex items-center gap-[10px] font-ui text-[15px] font-semibold text-text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-xs border border-ink bg-ink text-bg">
            <Icon name="cup" className="h-4 w-4" />
          </span>
          CaffeineIQ
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-body font-medium text-text-secondary transition-colors hover:text-text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
