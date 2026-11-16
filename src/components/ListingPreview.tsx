import { formatPrice } from "@/lib/format";

export function ListingPreview({
  title,
  price,
  category,
  location,
  email,
  description,
  imageUrl,
}: {
  title: string;
  price: string;
  category: string;
  location: string;
  email: string;
  description: string;
  imageUrl: string | null;
}) {
  const amount = Number(price);
  const priceLabel =
    price.trim() !== "" && Number.isFinite(amount) && amount > 0 ? formatPrice(amount) : "Price";
  const titleLabel = title.trim() || "Title";
  const emailLabel = email.trim() || "seller@email.com";
  const place = location.trim();

  return (
    <div>
      <h2 className="mb-4 text-center text-[28px] font-bold tracking-tight">Preview</h2>
      <article className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.04)]">
        {imageUrl ? (
          // Local preview uses a blob URL, which next/image cannot optimize.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="photo-stripes aspect-[16/10] w-full" />
        )}
        <div className="px-5 py-5">
          <h3 className="text-[22px] font-bold leading-tight">{titleLabel}</h3>
          <p className="mt-1 text-[22px] font-bold leading-tight">{priceLabel}</p>
          <p className="mt-3 text-sm leading-5 text-[#65676b]">
            Listed just now
            {place ? (
              <>
                <br />
                in {place}
              </>
            ) : null}
          </p>
          {category ? <p className="mt-3 text-sm text-[#65676b]">Category: {category}</p> : null}
          {description.trim() ? (
            <>
              <h4 className="mt-4 text-[15px] font-bold">Description</h4>
              <p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap">{description}</p>
            </>
          ) : null}
          <h4 className="mt-4 text-[15px] font-bold">Seller Information</h4>
          <p className={`mt-1 text-[15px] break-all ${email.trim() ? "text-[#050505]" : "text-[#65676b]"}`}>
            {emailLabel}
          </p>
        </div>
      </article>
    </div>
  );
}
