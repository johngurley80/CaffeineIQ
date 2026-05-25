import Link from "next/link";

type FooterProps = {
  links: { label: string; href: string }[];
};

export function Footer({ links }: FooterProps) {
  return (
    <footer className="mt-6 border-t border-border pb-7 pt-7">
      <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-[18px] px-wrap-sm text-body text-text-tertiary md:px-wrap">
        <p>© {new Date().getFullYear()} CaffeineIQ. Educational only, not medical advice.</p>
        <nav className="flex gap-[22px]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
