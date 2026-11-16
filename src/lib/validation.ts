import { isCategory } from "@/lib/categories";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const price = Number(trimmed);
  if (!Number.isFinite(price) || price < 0 || price > 99_999_999) return null;
  return Math.round(price * 100) / 100;
}

export function validateListingFields(input: {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  contactEmail: string;
}): string | null {
  const title = input.title.trim();
  const description = input.description.trim();
  const location = input.location.trim();
  const contactEmail = input.contactEmail.trim().toLowerCase();

  if (!title) return "Add a title.";
  if (title.length > 120) return "Title must be 120 characters or fewer.";
  if (!isCategory(input.category)) return "Choose a category.";
  if (!description) return "Add a description.";
  if (description.length > 5000) return "Description must be 5,000 characters or fewer.";
  if (parsePrice(input.price) === null) return "Enter a valid price, like 120 or 19.99.";
  if (location.length > 120) return "Location must be 120 characters or fewer.";
  if (!EMAIL.test(contactEmail) || contactEmail.length > 254) {
    return "Enter a valid contact email.";
  }
  return null;
}

export function validateMessageFields(input: {
  buyerEmail: string;
  message: string;
}): string | null {
  const buyerEmail = input.buyerEmail.trim().toLowerCase();
  const message = input.message.trim();
  if (!EMAIL.test(buyerEmail) || buyerEmail.length > 254) {
    return "Enter a valid email address.";
  }
  if (!message) return "Write a message to the seller.";
  if (message.length > 2000) return "Message must be 2,000 characters or fewer.";
  return null;
}

export function friendlySupabaseError(message: string): string {
  if (/relation .* does not exist|schema cache|could not find the table/i.test(message)) {
    return "Supabase is missing the marketplace tables. Run supabase/schema.sql in the SQL editor, then try again.";
  }
  if (/bucket not found|listing-images/i.test(message)) {
    return "The listing-images storage bucket is missing. Run supabase/schema.sql in the SQL editor, then try again.";
  }
  if (/row-level security|permission denied/i.test(message)) {
    return "Supabase blocked this save. Run supabase/schema.sql so visitors can create listings and send messages.";
  }
  if (/invalid api key|jwt|apikey|unauthorized/i.test(message)) {
    return "Supabase rejected the API key. Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.";
  }
  if (/fetch failed|network|failed to fetch/i.test(message)) {
    return "Could not reach Supabase. Check the project URL and your connection.";
  }
  return message;
}
