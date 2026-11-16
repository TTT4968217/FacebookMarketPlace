import { Sidebar } from "@/components/Sidebar";

export function BrowseShell({
  activeCategory,
  query,
  children,
}: {
  activeCategory?: string;
  query?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-3 py-4 sm:px-4 lg:flex-row lg:items-start lg:gap-4">
      <Sidebar activeCategory={activeCategory} query={query} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
