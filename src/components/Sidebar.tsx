"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export function Sidebar({
  activeCategory,
  query = "",
}: {
  activeCategory?: string;
  query?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-4 hidden max-h-[calc(100vh-2rem)] w-[272px] shrink-0 overflow-y-auto rounded-xl bg-white py-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)] lg:block">
        <SidebarLinks pathname={pathname} activeCategory={activeCategory} query={query} />
      </aside>
      <div className="mb-4 lg:hidden">
        <div className="mb-3 flex gap-2">
          <Link
            href="/create"
            className="rounded-full bg-[#0866ff] px-4 py-2 text-sm font-semibold text-white"
          >
            Create listing
          </Link>
          <Link href="/listings" className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
            Your listings
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <CategoryLink category={undefined} activeCategory={activeCategory} query={query} label="All" />
          {CATEGORIES.map((category) => (
            <CategoryLink
              key={category}
              category={category}
              activeCategory={activeCategory}
              query={query}
              label={category}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SidebarLinks({
  pathname,
  activeCategory,
  query,
}: {
  pathname: string;
  activeCategory?: string;
  query: string;
}) {
  return (
    <nav aria-label="Marketplace">
      <p className="px-4 py-2 text-[17px] font-bold">Create new listing</p>
      <NavLink href="/create" active={pathname === "/create" || pathname.startsWith("/create/")}>
        <TagIcon />
        Choose listing type
      </NavLink>
      <NavLink href="/listings" active={pathname === "/listings"}>
        <ListIcon />
        Your listings
      </NavLink>
      <NavLink href="/help" active={pathname === "/help"}>
        <PersonIcon />
        Seller help
      </NavLink>

      <p className="mt-3 px-4 py-2 text-[17px] font-bold">Categories</p>
      {CATEGORIES.map((category) => {
        const active = category === activeCategory;
        return (
          <Link
            key={category}
            href={categoryHref(active ? undefined : category, query)}
            aria-current={active ? "page" : undefined}
            className={`mx-2 block rounded-lg px-3 py-2 text-[15px] ${
              active
                ? "bg-[#e7f3ff] font-semibold text-[#0866ff]"
                : "text-[#050505] hover:bg-black/[0.05]"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] ${
        active ? "bg-[#e7f3ff] font-semibold text-[#0866ff]" : "text-[#050505] hover:bg-black/[0.05]"
      }`}
    >
      {children}
    </Link>
  );
}

function CategoryLink({
  category,
  activeCategory,
  query,
  label,
}: {
  category?: string;
  activeCategory?: string;
  query: string;
  label: string;
}) {
  const active = category ? category === activeCategory : !activeCategory;
  return (
    <Link
      href={categoryHref(category, query)}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
        active ? "bg-[#e7f3ff] font-semibold text-[#0866ff]" : "bg-white text-[#050505]"
      }`}
    >
      {label}
    </Link>
  );
}

function categoryHref(category: string | undefined, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  const value = params.toString();
  return value ? `/?${value}` : "/";
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7.5 7.5-7.5 7.5L4 12.5Z" />
      <circle cx="8.2" cy="8.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 7h11M9 12h11M9 17h11" />
      <path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 19c1.2-2.4 3.2-3.5 6-3.5s4.8 1.1 6 3.5" />
    </svg>
  );
}
