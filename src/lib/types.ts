export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  contact_email: string;
  image_url: string;
  image_path: string | null;
  listing_type: string;
  created_at: string;
};

export type ListingType = "item" | "multiple" | "vehicle" | "home";

export function toListing(row: {
  id: string;
  title: string;
  description: string | null;
  price: number | string;
  category: string;
  location: string | null;
  contact_email: string;
  image_url: string;
  image_path: string | null;
  listing_type: string | null;
  created_at: string;
}): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    price: Number(row.price),
    category: row.category,
    location: row.location ?? "",
    contact_email: row.contact_email,
    image_url: row.image_url,
    image_path: row.image_path,
    listing_type: row.listing_type ?? "item",
    created_at: row.created_at,
  };
}
