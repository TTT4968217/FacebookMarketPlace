export function SearchForm({ category, query }: { category?: string; query: string }) {
  return (
    <form action="/" method="get" className="mb-4 flex gap-2" role="search">
      {category ? <input type="hidden" name="category" value={category} /> : null}
      <div className="relative min-w-0 flex-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65676b]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" strokeLinecap="round" />
        </svg>
        <input
          key={query}
          name="q"
          defaultValue={query}
          placeholder="Search listings..."
          aria-label="Search listings"
          className="h-10 w-full rounded-lg border border-[#ccd0d5] bg-white pr-3 pl-9 text-[15px] outline-none placeholder:text-[#8a8d91] focus:border-[#0866ff]"
        />
      </div>
      <button
        type="submit"
        className="h-10 shrink-0 cursor-pointer rounded-lg bg-black px-4 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Search
      </button>
    </form>
  );
}
