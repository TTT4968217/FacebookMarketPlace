import { BrowseShell } from "@/components/BrowseShell";

export const metadata = {
  title: "Seller help",
};

export default function HelpPage() {
  return (
    <BrowseShell>
      <h1 className="mb-4 text-[24px] font-bold tracking-tight">Seller help</h1>
      <div className="max-w-2xl space-y-4 rounded-xl bg-white px-5 py-5 text-[15px] leading-7 shadow-sm">
        <section>
          <h2 className="font-bold">Create a listing</h2>
          <p className="mt-1 text-[#050505]">
            Choose a listing type, then add one photo, a title, a category, a price, your contact
            email, and a description. The listing is saved in Supabase and shows up on Today&apos;s picks.
          </p>
        </section>
        <section>
          <h2 className="font-bold">Photos</h2>
          <p className="mt-1">
            JPEG, PNG, or WebP, up to 5MB. A clear photo of the item helps buyers recognize it.
          </p>
        </section>
        <section>
          <h2 className="font-bold">Messages</h2>
          <p className="mt-1">
            Buyers do not need an account. When someone uses Message Seller, their email and message
            are saved in Supabase. If email delivery is configured, you also get a copy at the contact
            email on the listing.
          </p>
        </section>
        <section>
          <h2 className="font-bold">Find what you posted</h2>
          <p className="mt-1">
            Open Your listings and enter the same contact email you used on the form.
          </p>
        </section>
      </div>
    </BrowseShell>
  );
}
