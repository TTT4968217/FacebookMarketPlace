import Link from "next/link";
import { BrowseShell } from "@/components/BrowseShell";

const types = [
  {
    href: "/create/item?type=item",
    title: "Item for sale",
    subtitle: "Sell a single item",
    icon: <ItemIcon />,
  },
  {
    href: "/create/item?type=multiple",
    title: "Create multiple listings",
    subtitle: "List several items",
    icon: <StackIcon />,
  },
  {
    href: "/create/item?type=vehicle",
    title: "Vehicle for sale",
    subtitle: "Sell a car, bike, or other vehicle",
    icon: <VehicleIcon />,
  },
  {
    href: "/create/item?type=home",
    title: "Home for sale or rent",
    subtitle: "List a house, apartment, or room",
    icon: <HomeIcon />,
  },
];

export default function ChooseListingTypePage() {
  return (
    <BrowseShell>
      <h1 className="mb-8 text-center text-[28px] font-bold tracking-tight">Choose listing type</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {types.map((type) => (
          <Link
            key={type.href}
            href={type.href}
            className="flex min-h-[230px] flex-col items-center justify-center rounded-xl bg-white px-5 py-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4e6eb] text-[#65676b]">
              {type.icon}
            </span>
            <span className="mt-4 text-[17px] font-bold leading-snug">{type.title}</span>
            <span className="mt-2 text-sm text-[#65676b]">{type.subtitle}</span>
          </Link>
        ))}
      </div>
    </BrowseShell>
  );
}

function ItemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 12.5V6.5A1.5 1.5 0 0 1 5.5 5h6.5L20 13l-7 7L4 12.5Z" />
      <circle cx="8" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 15h16l-1.2-4.2a2 2 0 0 0-1.9-1.3H7.1a2 2 0 0 0-1.9 1.3L4 15Z" />
      <circle cx="7.5" cy="16.5" r="1.4" />
      <circle cx="16.5" cy="16.5" r="1.4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m4 11 8-7 8 7" />
      <path d="M6.5 10.5V19h11v-8.5" />
    </svg>
  );
}
