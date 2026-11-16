import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-black/10 bg-white px-3 sm:px-4">
      <Link href="/" className="flex min-w-0 items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0866ff] text-xl font-bold leading-none text-white sm:h-10 sm:w-10 sm:text-[22px]">
          F
        </span>
        <span className="truncate text-lg font-bold tracking-tight text-[#050505] sm:text-[22px]">
          Marketplace
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-1 text-[#050505] sm:gap-2" aria-hidden="true">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] sm:h-10 sm:w-10">
          <MailIcon />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] sm:h-10 sm:w-10">
          <BellIcon />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] sm:h-10 sm:w-10">
          <UserIcon />
        </span>
      </div>
    </header>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.2 1.5H4.8L6 16.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5.5 19.2c1.4-2.6 3.6-3.7 6.5-3.7s5.1 1.1 6.5 3.7" />
    </svg>
  );
}
