const SELLER_EMAIL_KEY = "marketplace:seller-email";
const BUYER_EMAIL_KEY = "marketplace:buyer-email";

export function rememberSellerEmail(email: string) {
  try {
    localStorage.setItem(SELLER_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // Storage can be blocked. The listing is still saved in Supabase.
  }
}

export function readSellerEmail(): string {
  try {
    return localStorage.getItem(SELLER_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function rememberBuyerEmail(email: string) {
  try {
    localStorage.setItem(BUYER_EMAIL_KEY, email.trim().toLowerCase());
  } catch {
    // Ignore storage failures.
  }
}

export function readBuyerEmail(): string {
  try {
    return localStorage.getItem(BUYER_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}
